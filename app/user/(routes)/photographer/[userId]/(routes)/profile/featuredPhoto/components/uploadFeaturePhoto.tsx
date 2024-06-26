import React, { useState } from 'react'
import { CldUploadWidget, CldUploadWidgetInfo, CldUploadWidgetResults } from 'next-cloudinary';
import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";
import { useSession } from 'next-auth/react';

interface UploadFeaturePhoto {
    userId: string | string[];
    index: number;
    handleUpdateFeaturePhoto: (index: number, newUrl: string) => Promise<void>;
}

const UploadFeaturePhoto = ({ userId, index, handleUpdateFeaturePhoto }: UploadFeaturePhoto) => {

    const handleAspectRation = (index: number) => {
        switch (index) {
            case 0:
                return 0.67;
            case 1:
                return 0.76;
            case 2:
                return 0.76;
            case 3:
                return 0.67;
            default:
        }
    }

    const [coverImageURL, setCoverImageURL] = useState("https://res.cloudinary.com/image/upload/v1707855067/hlnolejsok99gjupmfbi.jpg");
    const [coverPhotos, setCoverPhotos] = useState<string[]>([]);
    console.log("index and image: " + index);
    const { data: session } = useSession();
    const [isPhotographer, setIsPhotographer] = useState(true);
    const [featuredPhotoURL, setFeaturedPhotoURL] = useState("https://res.cloudinary.com/dts2l2pnj/image/upload/v1707855067/hlnolejsok99gjupmfbi.jpg");

    return (
        <main>
            <div className="w-full pr-10">
                {isPhotographer && (
                    <CldUploadWidget
                        onOpen={() => { }}
                        onSuccess={(results: CldUploadWidgetResults) => {
                            const uploadedResult = results.info as CldUploadWidgetInfo;
                            const FeaturedURL = {
                                image: uploadedResult.secure_url,
                            };
                            setFeaturedPhotoURL(FeaturedURL.image);
                            handleUpdateFeaturePhoto(index, uploadedResult.secure_url)
                        }
                        }

                        options={{
                            tags: ["featured"],
                            sources: ["local"],
                            googleApiKey: "<image_search_google_api_key>",
                            showAdvancedOptions: false,
                            singleUploadAutoClose: true,
                            cropping: true,
                            croppingCoordinatesMode: "custom",
                            croppingAspectRatio: handleAspectRation(index),
                            multiple: false,
                            defaultSource: "local",
                            resourceType: "image",
                            folder: `anothershot/${session?.user.id}/featured`,
                            styles: {
                                palette: {
                                    window: "#ffffff",
                                    sourceBg: "#f4f4f5",
                                    windowBorder: "#90a0b3",
                                    tabIcon: "#000000",
                                    inactiveTabIcon: "#555a5f",
                                    menuIcons: "#555a5f",
                                    link: "#000000",
                                    action: "#000000",
                                    inProgress: "#464646",
                                    complete: "#000000",
                                    error: "#cc0000",
                                    textDark: "#000000",
                                    textLight: "#fcfffd",
                                },
                            },
                        }}
                        uploadPreset={`${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`}
                    >
                        {({ open }) => {
                            return (
                                <Button
                                    variant="outline"
                                    size={'icon'}
                                    className="rounded-md mt-2 ml-2 w-8 h-8"
                                    onClick={() => {
                                        open();
                                    }}
                                >
                                    <PenSquare style={{ color: 'black' }} />
                                </Button>
                            );
                        }}
                    </CldUploadWidget>
                )}
            </div >
        </main >
    )
}

export default UploadFeaturePhoto;