import { StockData } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { BuyStocksPopup } from "./buy-stocks-popup";
export const columns: ColumnDef<StockData>[] = [
  {
    accessorKey: "symbol",
    header: ({ column }) => {
      return (
        <div
          className="cursor-pointer flex justify-start items-center "
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Symbol
          <ArrowUpDown className=" ml-1 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => <div className="text-left">{row.original.symbol}</div>,
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
        currency: "KSH",
      })
        .format(price)
        .replace("KSH", "Ksh") // Change to title case
        .replace(/^(Ksh\s*)(\d)/, "$1 $2"); // Add space after currency;

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "change",
    header: "Change",
  },
  {
    accessorKey: "tokenID",
    header: "Token ID",
  },
  {
    id: "actions",
    header: "Actions",

    cell: ({ row }) => <BuyStocksPopup entry={row.original} />,
  },
];
