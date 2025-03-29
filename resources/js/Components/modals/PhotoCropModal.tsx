import BaseModal, { BaseModalProps } from "./BaseModal";
import { DialogTitle, DialogPanel } from "@headlessui/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import Crop from "../icons/Crop";
import ReactCrop, { Crop as CropType } from "react-image-crop";
import { useRef, useState } from "react";

interface PhotoCropModalProps extends Omit<BaseModalProps, "children" | "open"> {
    file: File
    onCrop: (f: File) => any
}

export default function PhotoCropModal({ onClose, onCrop, file }: PhotoCropModalProps) {
    const { t } = useLaravelReactI18n()
    const [crop, setCrop] = useState<CropType>();
    const src = URL.createObjectURL(file)
    const isCropable = !!(crop?.width && crop.height)
    const imgRef = useRef<null | HTMLImageElement>(null)

    const applyCrop = () => {
        if (!imgRef.current || !crop || !crop.width || !crop.height) return;

        const image = imgRef.current;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Get the real dimensions of the image
        const scaleDiff = image.naturalWidth / image.width;

        // Correct the crop values based on the actual image size
        const cropX = crop.x * scaleDiff;
        const cropY = crop.y * scaleDiff;
        const cropWidth = crop.width * scaleDiff;
        const cropHeight = crop.height * scaleDiff;

        // Set canvas size to the cropped area
        canvas.width = cropWidth;
        canvas.height = cropHeight;

        // Draw the cropped portion onto the canvas
        ctx.drawImage(
            image,
            cropX, cropY, cropWidth, cropHeight,
            0, 0, cropWidth, cropHeight
        );

        // Convert canvas to a file
        canvas.toBlob((blob) => {
            if (!blob) return;
            const croppedFile = new File([blob], file.name, { type: file.type });
            onCrop(croppedFile);
            onClose();
        }, file.type);

    };

    return (
        <BaseModal open={!!file} onClose={onClose}>
            <div className="fixed inset-0 w-screen overflow-y-auto">
                <div className="flex min-h-full justify-center m-4 text-center items-center">
                    <DialogPanel
                        className="relative transform overflow-hidden rounded-lg bg-background-light dark:bg-background-dark text-start shadow-xl w-full max-w-md"
                    >
                        <form className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex flex-col gap-4">
                            <div className="bg-background-light dark:bg-background-dark">
                                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                    <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary/25 dark:bg-secondary/25 sm:mx-0 sm:size-10">
                                        <span aria-hidden="true" className="size">
                                            <Crop size={16} />
                                        </span>
                                    </div>
                                    <div className="text-center sm:text-start w-full">
                                        <DialogTitle as="h3" className="text-base font-semibold">
                                            {t("settings.crop_modal_title")}
                                        </DialogTitle>
                                        <p className="text-secondary text-xs">{t("settings.crop_modal_desc")}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <ReactCrop
                                    aspect={1}
                                    circularCrop
                                    crop={crop}
                                    onChange={(corp) => setCrop(corp)}
                                    minWidth={250}
                                    minHeight={250}
                                    maxWidth={1024}
                                    maxHeight={1024}
                                >
                                    <img ref={imgRef} src={src} />
                                </ReactCrop>
                            </div>
                            <button
                                type="button"
                                onClick={applyCrop}
                                className="flex w-full ms-auto sm:w-auto justify-center rounded-md bg-primary text-onPrimary mt-4 px-4 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-primary/90 disabled:opacity-75 disabled:cursor-not-allowed"
                                disabled={!isCropable}
                            >
                                {t("settings.crop")}
                            </button>
                        </form>
                    </DialogPanel>
                </div>
            </div>
        </BaseModal>
    );
}

