"use client";

import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { BiSolidPlusSquare } from "react-icons/bi";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import cn from "classnames";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import axios from 'axios';
import { useParams } from "next/navigation";
import { useSession } from 'next-auth/react';
import { Package } from "@/app/lib/types";
import { Photographer } from "@/app/lib/types";
import toast from 'react-hot-toast';

const formSchema = z.object({
    eventName: z.string().min(2, "Event name should be between 5-50 characters").max(50, "Event name should be between 2-50 characters"),
    eventLocation: z.string().min(2, "Event location should be between 5-50 characters").max(50, "Event location should be between 2-50 characters"),
    sdate: z.date({required_error: "A date is required.",}),
    edate: z.date({required_error: "A date is required.",}),
    stime: z.string().refine(value => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value), {
        message: "Invalid time string! Should be in the format HH:mm.",
      }),
    etime: z.string().refine(value => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value), {
        message: "Invalid time string! Should be in the format HH:mm.",
      }),
    eventType: z.string(),
    package: z.string(),

});

const AddBooking = () => {
    const { userId } = useParams();
    const { data: session } = useSession();
    const [isOpened, setIsOpened] = React.useState(false);
    const [photographer, setPhotographer] = React.useState<Photographer[]>([]);
    const [packages, setPackages] = React.useState<Package[]>([]);
    const [loading, setLoading] = React.useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            eventName: "",
            eventLocation: "",
            stime: "",
            etime: "",
        },
    });

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/photographer/${userId}/bookingsPackage`);
                setPackages(response.data);
            } catch (error: any) {
                console.error('Error fetching packages:', error);
                toast.error('Error fetching packages:', error);
            }
        };
        fetchPackages();
    }, [userId]);

    useEffect(() => {
        const fetchPhotographer = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/photographer/${userId}/bookingsCategory`);
                setPhotographer(response.data);
                console.log(response.data);
            } catch (error: any) {
                console.error('Error fetching photographer:', error);
                toast.error('Error fetching photographer:', error);
            }
        };
        fetchPhotographer();
    }, [userId]);

    const onSubmit = async (values: z.infer<typeof formSchema>, e: any) => {

        const sdateString = values.sdate.toISOString();
        const edateString = values.edate.toISOString();
        console.log(sdateString);
        try {
            setLoading(true);
            if (values) {
              const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/photographer/${userId}/clientBooking`, {
                clientId: session?.user?.id,
                photographerId: userId,
                eventName: values.eventName,
                eventLocation: values.eventLocation,
                startDate: sdateString,
                endDate: edateString,
                startTime: values.stime,
                endTime: values.etime,
                category: values.eventType,
                packageId: values.package,
              });
      
              if (response.status === 201) {
                setLoading(false);
                e.target.reset();
                toast.success("Booking request sent successfully!");
              }
            }
          } catch (error) {
            setLoading(false);
            toast.error("Error booking requesting");
          } finally {
            setLoading(false);
          }
      
        console.log(values);
        setIsOpened(false);
        form.reset();

    };
    const categories = photographer?.map((photographerItem: Photographer) => photographerItem.category);
    console.log("Categories:", categories);

    return (
        <div className='flex justify-end'>
            {session?.user.id !== userId && (
                <Dialog open={isOpened} onOpenChange={setIsOpened}>
                    <DialogTrigger>
                        <BiSolidPlusSquare size={50} />
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Booking</DialogTitle>
                            <DialogDescription>
                                Add a booking
                            </DialogDescription>
                        </DialogHeader>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="eventName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Event Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Event Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="eventLocation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Location</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Event Location" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="sdate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Start Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[240px] pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="edate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>End Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[240px] pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="stime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Time</FormLabel>
                                            <FormControl>
                                                <Input placeholder="HH:mm" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="etime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End Time</FormLabel>
                                            <FormControl>
                                                <Input placeholder="HH:mm" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="eventType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Evet Type</FormLabel>
                                            <Select onValueChange={field.onChange}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select the event type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent >
                                                    <SelectGroup>
                                                        {categories?.map((cat: string[]) => (
                                                            cat.map((item: string, index: number) => (
                                                                <SelectItem key={index} value={item}>
                                                                    {item}
                                                                </SelectItem>
                                                            ))
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="package"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Packages</FormLabel>
                                            <Select onValueChange={field.onChange}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a package" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent >
                                                    <SelectGroup>
                                                        {packages.map((packageItem) => (
                                                            <SelectItem key={packageItem.id} value={packageItem.id}>
                                                                {packageItem.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Request</Button>
                            </form>
                        </Form>

                    </DialogContent>

                </Dialog>
            )}
        </div>
    );
};


export default AddBooking;