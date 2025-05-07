import { useState } from 'react';
import { FaBox } from "react-icons/fa";

export default function NotFound() {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-600 text-white px-4 relative overflow-hidden">
            {/* Wave SVG at bottom */}
            <div className="absolute bottom-0 left-0 w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
                    <path fill="#f8fafc" fillOpacity="1" d="M0,96L80,85.3C160,75,320,53,480,53.3C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                </svg>
            </div>

            <div className="max-w-md w-full text-center z-10">
                <div className="mb-8 flex justify-center">
                    <div
                        className="p-6 rounded-full bg-white bg-opacity-10 border border-white border-opacity-20 shadow-lg"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <FaBox
                            size={48}
                            className={`text-blue-600 ${isHovering ? 'rotate-12 transition-transform' : 'transition-transform'}`}
                        />
                    </div>
                </div>

                <h1 className="text-5xl font-bold mb-3 tracking-tight">Page not found</h1>
                <p className="text-blue-100 mb-10 text-lg">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <div className="flex flex-col gap-4">
                    <a
                        href="/"
                        className="px-4 py-3 bg-white text-blue-600 rounded-lg font-medium transition-colors hover:bg-blue-50"
                    >
                        Return to home
                    </a>

                    <button
                        onClick={() => window.history.back()}
                        className="px-4 py-3 bg-blue-700 text-white rounded-lg font-medium border border-blue-500 transition-colors hover:bg-blue-800 cursor-pointer"
                    >
                        Go back
                    </button>
                </div>

                <div className="flex items-center justify-center mt-16 mb-8">
                    <div className="bg-white p-2 rounded mr-2">
                        <FaBox className="text-blue-600" size={20} />
                    </div>
                    <p className="text-white text-lg font-medium">
                        Zynote
                    </p>
                </div>
            </div>
        </div>
    );
}