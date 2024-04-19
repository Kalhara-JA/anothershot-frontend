"use client";

import * as z from "zod";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  CldUploadWidgetResults,
  CldUploadWidgetInfo,
  CldUploadWidget,
} from "next-cloudinary";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { PenSquare, Camera } from "lucide-react";
import { Client, Suspended, User } from "@/app/lib/types";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

const ProfileBio = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [client, setClient] = useState<Client>();
  const [values, setValues] = useState({
    name: "",
    bio: "",
  });
  const [profileImage, setProfileImage] = useState("");
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const [isSuspended, setIsSuspended] = useState<Suspended>("NOT_SUSPENDED");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/client/${userId}/clientDetails`);
        setClient(response.data);
      } catch (error: any) {
        console.error('Error fetching details:', error);
      }
    };
    fetchClients();
  }, [userId]);
  useEffect(() => {
    if (client) {
      setValues({
        name: client.name,
        bio: client.bio || "",
      });
      setProfileImage(client.user.image ?? "https://res.cloudinary.com/dcyqrcuf3/image/upload/v1711878461/defaultImages/default-profile-image_grcgcd.png");
    }
  }, [client]);

  useEffect(() => {
    const user = async () => {
      try {
        const res = await axios.get<User>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}/profile`
        );
        setIsSuspended(res.data.suspended);
      }
      catch (err) {
        console.error(err);
      }
    };
    user();

  }, [session]);


  return (
    <div className=" rounded-lg bg-slate-100 drop-shadow-xl w-11/12 lg:w-1/3 h-auto p-3 lg:mr-5">
      <div className="flex justify-between">
        <Avatar className="w-20 h-20">
          <AvatarImage
            src={profileImage}
            alt="@shadcn"
            className="absolute"
          />
        </Avatar>
      </div>
      <div className="flex flex-col">
        <h1 className="texl-xl lg:text-2xl font-bold">{values.name}</h1>
        <p className="text-gray-700 font-normal text-xs lg:text-base leading-4">@{client?.user.userName}</p>
        <p className="text-xs lg:text-sm pt-3">{values.bio}</p>
      </div>


    </div>
  );
};

export default ProfileBio;