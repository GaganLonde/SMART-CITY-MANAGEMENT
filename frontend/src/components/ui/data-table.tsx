import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends { id?: number | string }>({ 
  columns, 
  data, 
  isLoading,
  emptyMessage = "No data available",
  onRowClick
}: DataTableProps<T>) {
  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];
  const safeColumns = Array.isArray(columns) ? columns : [];

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (safeData.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-2 text-muted-foreground">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="border-border bg-muted/30 hover:bg-muted/30">
            {safeColumns.map((column) => (
              <TableHead 
                key={column.key} 
                className={cn("text-xs font-semibold uppercase tracking-wider text-muted-foreground", column.className)}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {safeData.map((item, index) => (
            <TableRow 
              key={item?.id ?? index}
              onClick={() => onRowClick?.(item)}
              className={cn(
                "border-border transition-colors",
                onRowClick && "cursor-pointer hover:bg-muted/50"
              )}
            >
              {safeColumns.map((column) => (
                <TableCell key={column.key} className={cn("text-sm", column.className)}>
                  {column.render 
                    ? (() => {
                        try {
                          return column.render(item);
                        } catch (error) {
                          console.error('Error rendering column:', error);
                          return (item as any)?.[column.key] ?? "N/A";
                        }
                      })()
                    : (item as any)?.[column.key] ?? "N/A"
                  }
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
