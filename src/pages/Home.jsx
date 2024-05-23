import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div className="bg-blue-50 flex flex-col justify-between h-full">

            <main className="flex-1 flex flex-col items-center p-4">
                <section className="w-full max-w-4xl text-center my-8">
                    <h2 className="text-2xl font-semibold text-blue-900 mb-4">Create Blogs Effortlessly</h2>
                    <p className="text-blue-700 mb-6">
                        Generate high-quality blog posts with just a few clicks. Leverage the power of AI to streamline your content creation process.
                    </p>
                    <Link to={'/dashboard'} className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800">
                        Get Started
                    </Link>
                </section>

                <section className="w-full max-w-6xl my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-4">
                            <h3 className="text-xl font-semibold text-blue-900">Exploring the Wilderness</h3>
                            <p className="text-blue-700 mt-2">Dive into the heart of nature with our latest blog. Discover hidden trails, breathtaking landscapes, and the serenity of the great outdoors. Let your adventurous spirit soar as we guide you through the untamed wilderness. Click to read more.</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-4">
                            <h3 className="text-xl font-semibold text-blue-900">The Art of Gastronomy</h3>
                            <p className="text-blue-700 mt-2">Indulge your senses in the world of culinary delights. Join us on a gastronomic journey filled with tantalizing flavors, exquisite dishes, and culinary masterpieces. From street food to haute cuisine, explore the diverse palette of tastes that the world has to offer. Click to read more.</p>
                        </div>
                    </div>
                </section>



            </main>

        </div>
    )
}

export default Home