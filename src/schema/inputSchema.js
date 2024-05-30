 
import { z } from "zod"
 
const formSchema = z.object({
  prompt: z.string().min(2).max(1000),
})

export {
    formSchema
}



// async function onSubmit(values) {
//   setLoading(true);
//   const urls = []
//   try {
//     // // Your API call code
//     // for (let i = 0; i < Math.ceil(Math.random()) * 4; i++) {
//     //   const imageResponse = await axios.post(
//     //     "https://api.vansh.one/",
//     //     {
//     //       model: "VisionBrush",
//     //       text: `Create unique Blog post Cover Image For Following Title: ${values.prompt}`
//     //     },
//     //     {
//     //       headers: {
//     //         AuthKey: import.meta.env.VITE_VISION_API_KEY,
//     //       },
//     //     }
//     //   );
//     //   urls.push(imageResponse.data.Response)
//     // }
//     const imageArray = [
//       "https://via.placeholder.com/1200x500/0000FF/808080",
//       "https://via.placeholder.com/1200x500/FF0000/FFFFFF"
//     ];
//     setImageUrl(imageArray); // Store the image URL

//     const blogResponse = await axios.post(
//       "https://api.vansh.one/",
//       {
//         model: "Vision",
//         tools: ["Brush"],
//         messages: [
//           {
//             role: "system",
//             type: "text",
//             content: "You are a helpful Blog Writer for the user. Create a detailed, informative, and engaging blog post for the user.",
//           },
//           {
//             role: "user",
//             type: "text",
//             content: values.prompt,
//           }
//         ],
//       },
//       {
//         headers: {
//           AuthKey: import.meta.env.VITE_VISION_API_KEY,
//         },
//       }
//     );

//     setBlogResponse(blogResponse.data); // Store the blog response
//   } catch (error) {
//     console.error('Error:', error);
//   } finally {
//     setLoading(false);
//   }
// }