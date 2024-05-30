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
import showdown from 'showdown';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const AiChat = () => {
  const [loadingText, setLoadingText] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [blogResponses, setBlogResponses] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onSubmit(values) {
    setLoadingText(true);
    setBlogResponses([]);
    setImageUrls([]);
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
        setBlogResponses((prevResponses) => [
          ...prevResponses,
          textResponse.data.Response[0].content,
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
        setImageUrls((prevUrls) => [
          ...prevUrls,
          imageResponse.data.Response[0].url,
        ]);

        // Optional delay between requests
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setLoadingText(false);
      setLoadingImage(false);
    } catch (error) {
      console.error('Error:', error);
      setLoadingText(false);
      setLoadingImage(false);
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
                <Button type="submit" className="mt-5" disabled={loadingText || loadingImage}>
                  {loadingText ? 'Generating Text...' : loadingImage ? 'Generating Image...' : 'Generate Blog'}
                </Button>
              </form>
            </Form>
          </section>
        </Card>

        {blogResponses.length > 0 && (
          <Card className="w-[90%] md:w-[80%] h-full mt-5 p-4 shadow-md">
            <p className='font-bold text-left text-blue-700 text-2xl'>Generated Blog Post</p>
            {imageUrls.length > 0 && (
              <Carousel>
                <CarouselContent className="w-full h-full flex">
                  {imageUrls.map((url, index) => (
                    <CarouselItem key={index}>
                      <img src={url} alt={`Slide ${index + 1}`} className='p-2' />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-3" />
                <CarouselNext className="absolute right-3" />
              </Carousel>
            )}
            <section className='mt-10'>
              {blogResponses.map((response, index) => (
                <div key={index}>
                  <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(response) }}></div>
                  {imageUrls[index] && <img src={imageUrls[index]} alt={`Generated for response ${index}`} className='p-2' />}
                </div>
              ))}
            </section>
          </Card>
        )}
      </div>
    </div>
  );
}

export default AiChat;
