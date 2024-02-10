import Image from "next/image";
import React from "react";

type Props = {
  apiEndpoint: "agencyLogo" | "avatar" | "subaccountLogo";
  onChnage: () => void;
  value?: string;
};

const FileUpload = ({ apiEndpoint, onChnage, value }: Props) => {
  const type = value?.split(".").pop();
  if (value) {
    return (
      <div className="flex flex-col justify-center items-center">
        {type !== "pdf" ? (
          <div className="relative w-40 h-40">
            <Image
              src={value}
              alt="Uploaded Image"
              className="object-contain"
              fill
            />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
  return <div>FileUpload</div>;
};

export default FileUpload;
