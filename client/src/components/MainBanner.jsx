import React from 'react';
import { assets } from '../assets/assets.js';
import { Link } from 'react-router-dom';

const MainBanner = () => {
  return (
    <div className='relative w-full'>
      <img src={assets.main_banner_bg} alt="banner" className='w-full hidden md:block' />
      <img src={assets.main_banner_bg_sm} alt="banner" className='w-full md:hidden' />

      <div className='absolute inset-0 flex flex-col justify-center items-start text-left px-2 sm:px-6 md:px-12 lg:px-20 py-2'>
        <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-black max-w-2xl leading-tight'>
            Freshness you can Trust, Savings you will Love!
        </h1>
      
      <div className='flex items-center mt-6 font-medium'>
        <Link to={"/products"} className='group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded text-white cursor-pointer'>Shop Now 
        <img className='md:hidden transition group-focus:translate-x-1' src={assets.white_arrow_icon} alt="arrow"/>
        </Link>

        <Link to={"/products"} className='group hidden md:flex items-center gap-2 px-9 py-3 cursor-pointer'>Explore Deals 
        <img className='transition group-hover:translate-x-1' src={assets.black_arrow_icon} alt="arrow"/>
        </Link>

      </div>
      </div>
    </div>
  );
}

export default MainBanner;
