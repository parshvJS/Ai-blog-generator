import { Card } from '@/components/ui/card';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from 'react-hook-form';
import { formSchema } from '@/schema/inputSchema';
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';
import showdown from 'showdown';

const AiChat = () => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState([]);
  const bottomRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [content]);

  async function onSubmit(values) {
    setLoading(true);
    setContent([]);
    try {
      const requests = [
        {
          role: "user",
          type: "text",
          content: `Create Creative and engaging introduction part of blog for title with impressive and to the point large introduction of title: ${values.prompt}`,
        },
        {
          role: "user",
          type: "text",
          content: `This is my title. Create a large and informative blog, full of information and content. Create detailed blog titled: ${values.prompt}`,
        },
        {
          role: "user",
          type: "text",
          content: `Write a concise and impactful summary for the blog titled avoid introduction and summary title etc. just focus on full content: ${values.prompt}`,
        },
      ];

      for (const message of requests) {
        // Generate text
        const textResponse = await axios.post(
          "https://api.vansh.one/",
          {
            model: "Vision",
            tools: ["Brush"],
            messages: [
              {
                role: "system",
                type: "text",
                content: "You are a helpful Blog Writer for the user. Create a detailed, informative, and engaging blog post for the user as long as possible. Very large and informative blog.",
              },
              message,
            ],
          },
          {
            headers: {
              AuthKey: import.meta.env.VITE_VISION_API_KEY,
            },
          }
        );
        const newText = textResponse.data.Response[0].content;
        setContent((prevContent) => [
          ...prevContent,
          { type: 'text', content: newText },
        ]);

        // Generate image
        const imageResponse = await axios.post(
          "https://api.vansh.one/",
          {
            model: "VisionBrush",
            text: `Create unique Blog post Cover Image For Following Title: ${values.prompt}`
          },
          {
            headers: {
              AuthKey: import.meta.env.VITE_VISION_API_KEY,
            },
          }
        );
        const newImage = imageResponse.data.Response;
        setContent((prevContent) => [
          ...prevContent,
          { type: 'image', content: newImage },
        ]);

        // Optional delay between requests
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  }

  const converter = new showdown.Converter();

  return (
    <div className='h-full'>
      <div className='flex max-w-full flex-col justify-between items-center'>
        <Card className="w-[90%] md:w-[80%] h-full mt-5 p-4 shadow-md">
          <p className='font-bold text-left text-blue-700 text-2xl'>Generate New Blog</p>

          <section className='mt-10'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-8 gap-4">
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-700 text-lg">Prompt</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Your Prompt Here" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="mt-5" disabled={loading}>
                  {loading ? 'Generating...' : 'Generate Blog'}
                </Button>
              </form>
            </Form>
          </section>
        </Card>

        {content.length > 0 && (
          <Card className="w-[90%] md:w-[80%] h-full mt-5 p-4 shadow-md">
            <p className='font-bold text-left text-blue-700 text-2xl'>Generated Blog Post</p>
            <section className='mt-10'>
              {content.map((item, index) => (
                <div key={index}>
                  {item.type === 'text' ? (
                    <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(item.content) }}></div>
                  ) : (
                    <img src={item.content} alt={`Generated for response ${index}`} className='p-2' />
                  )}
                </div>
              ))}
            </section>
          </Card>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default AiChat;
