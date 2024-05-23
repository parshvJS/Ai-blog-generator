import { Card } from '@/components/ui/card';
import React, { useState } from 'react';
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
import showdown from 'showdown'; // Import showdown package

const AiChat = () => {
  const [loading, setLoading] = useState(false);
  const [blogResponse, setBlogResponse] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onSubmit(values) {
    setLoading(true);
    try {
      // Your API call code
      const imageResponse = await axios.post(
        "https://api.vansh.one/",
        {
          model: "VisionBrush",
          text: `Create Blog post Cover Image For Following Title: ${values.prompt}`
        },
        {
          headers: {
            AuthKey: import.meta.env.VITE_VISION_API_KEY,
          },
        }
      );

      setImageUrl(imageResponse.data.Response); // Store the image URL

      const blogResponse = await axios.post(
        "https://api.vansh.one/",
        {
          model: "Vision",
          tools: ["Brush"],
          messages: [
            {
              role: "system",
              type: "text",
              content: "You are a helpful Blog Writer for the user. Create a detailed, informative, and engaging blog post for the user.",
            },
            {
              role: "user",
              type: "text",
              content: values.prompt,
            }
          ],
        },
        {
          headers: {
            AuthKey: import.meta.env.VITE_VISION_API_KEY,
          },
        }
      );

      setBlogResponse(blogResponse.data); // Store the blog response
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  const converter = new showdown.Converter(); // Create a new showdown converter instance

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
                  {loading ? 'Loading...' : 'Submit'}
                </Button>
              </form>
            </Form>
          </section>
        </Card>

        {blogResponse && (
          <Card className="w-[90%] md:w-[80%] h-full mt-5 p-4 shadow-md">
            <p className='font-bold text-left text-blue-700 text-2xl'>Generated Blog Post</p>
            {imageUrl && <img src={imageUrl} alt="Generated Cover" className="mb-4 mt-5 rounded-md w-full h-fit" />}
            <section className='mt-10'>
              <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(blogResponse.Response[0].content) }}></div>
            </section>
          </Card>
        )}
      </div>
    </div>
  );
}

export default AiChat;
