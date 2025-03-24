"use client";
import { StockData } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { ColumnActions } from "./column-actions";
export const columns: ColumnDef<StockData>[] = [
  {
    accessorKey: "symbol",
    header: ({ column }) => {
      return (
        <div
          className="cursor-pointer flex gap-1 items-center "
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Symbol
          <ArrowUpDown className=" h-4 w-4" />
        </div>
      );
    },
  },

  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "ksh",
      }).format(price);

      return <div className="tracking-wide">{formatted}</div>;
    },
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
