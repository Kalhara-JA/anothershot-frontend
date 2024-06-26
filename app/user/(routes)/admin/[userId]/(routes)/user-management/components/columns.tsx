// "use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { UserDetail } from "./userDetail";
import Link from "next/link";
import {User} from "@/app/lib/types";

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <div>
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        User Id
                        <ArrowDown className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => (
            <div className="py-3 text-sm font-medium leading-tight text-gray-900">
                {row.original.id}
            </div>
        ),
    },
    {
        accessorKey: "userRole",
        header: "User Role",
        cell: ({ row }) => (
            <div>
                {row.original.userRole === "PHOTOGRAPHER" ? (
                    <Badge variant="default">
                        {row.original.userRole}
                    </Badge>
                ) : row.original.userRole === "CLIENT" ? (
                    <Badge variant="secondary">{row.original.userRole}</Badge>
                ) : (
                    <Badge variant="outline">{row.original.userRole}</Badge>
                )}
            </div>
        ),
    },
    {
        accessorKey: "userName",
        header: ({ column }) => {
            return (
                <div>
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Username
                        <ArrowDown className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => (
            <UserDetail
                userName={row.original.userName}
                email={row.original.email}
                image={row.original.image}
            />
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <Button
                variant="secondary"
            >
                <Link href={`user-management/${row.original.id}/profile`}>
                    {" "}
                    View
                </Link>
            </Button>
        ),
    },
];
