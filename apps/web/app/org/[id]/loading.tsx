export default function Loading() {
    return (
        <div className="animate-pulseCustom w-screen h-screen">
            <div className="h-16 bg-gray-50 dark:bg-zinc-900 rounded-md w-full flex items-center justify-between">
                <div className="h-8 w-48 ml-12 dark:bg-zinc-800 bg-gray-200"></div>
                <div className="flex items-center justify-center gap-x-4 mr-8">
                    <div className="w-72 h-8 bg-gray-200 dark:bg-zinc-800 rounded-full"></div>
                    <div className="h-8 w-8 rounded-full dark:bg-zinc-800 bg-gray-200"></div>
                </div>
            </div>

            <div className="flex flex-row w-full h-full dark:bg-zinc-800">
                <div className="w-2/12 h-full bg-gray-100 rounded-md flex flex-col items-center mt-24 gap-y-4 dark:bg-zinc-800">
                    <div className="h-24 w-48 bg-gray-200 dark:bg-zinc-900"></div>
                    <div className="h-24 w-48 bg-gray-200 dark:bg-zinc-900"></div>
                    <div className="h-24 w-48 bg-gray-200 dark:bg-zinc-900"></div>
                    <div className="h-24 w-48 bg-gray-200 dark:bg-zinc-900"></div>
                    <div className="h-24 w-48 bg-gray-200 dark:bg-zinc-900"></div>
                </div>

                <div className="flex-grow">
                    <div className="h-20 bg-gray-100 dark:bg-zinc-800 rounded-md mb-4 flex items-center justify-end">
                        <div className="flex items-center justify-center gap-x-4 mr-8">
                            <div className="w-32 h-8 bg-gray-200 dark:bg-zinc-900"></div>
                            <div className=" w-32 h-8 bg-gray-200 dark:bg-zinc-900"></div>
                        </div>
                    </div>
                    <div className="h-[79vh] bg-gray-100 dark:bg-zinc-900">
                    </div>

                    <div className="fixed top-1/2 left-1/2 h-60 w-[400px] bg-gray-50 dark:bg-zinc-900 rounded-md z-50 transform -translate-x-1/2 -translate-y-1/2">
                    </div>
                </div>
            </div>
        </div>
    );
}


