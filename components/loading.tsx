"use client";

import { InfinitySpin } from 'react-loader-spinner';

const Loading= () =>   {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <p className='text-black text-lg md:text-xl font-bold'>Capturing your AnotherShot </p>
            <InfinitySpin
                width="200"
                color="#2c2b2b"
            />
        </div>
    )
}
export default Loading;
