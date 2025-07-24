import { FaCopyright } from "react-icons/fa";

export function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow-sm flex justify-center dark:bg-gray-800 dark:border-gray-600">
            <div className="flex items-center justify-center">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400 flex items-center">
                    2025. All Rights Reserved.
                    <FaCopyright className="ml-1" />
                </span>
            </div>
        </footer>
    )
}