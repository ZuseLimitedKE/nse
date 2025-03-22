"use client";

import { StockData } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { ColumnActions } from "./column-actions";
export const columns: ColumnDef<StockData>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "symbol",
    header: "Symbol",
  },

  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          className=" p-0 "
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className=" h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "change",
    header: "Change",
  },
  {
    id: "actions",
    header: "Actions",

    cell: ({ row }) => <ColumnActions entry={row.original} />,
  },
];
