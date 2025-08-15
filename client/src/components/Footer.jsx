import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                <div className=''>
                    <img src={assets.logo} className='mb-5 w-32' alt="" />
                    <p className='w-full md:w-2/3 text-gray-600'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt similique sapiente fuga quod maxime inventore rerum quaerat, expedita voluptatibus a accusantium. Quos in recusandae, tempora adipisci quo doloribus soluta facere, suscipit obcaecati voluptatem aperiam perferendis totam fuga pariatur, aliquid praesentium voluptatum. A quia assumenda molestiae ut, fugit nihil eius sint.
                    </p>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>

                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>+92-3497250893</li>
                        <li>webdev.anus@gmail.com</li>
                    </ul>
                </div>


            </div>
            <div className='text-gray-300'>
                <hr />
                <p className='py-5 text-sm text-gray-700 text-center'>
                    Copyright 2025@ forever.com - All Rights Reserved .
                </p>
            </div>
        </div>
    )
}

export default Footer