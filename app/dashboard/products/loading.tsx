import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProductsLoading() {
    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-10 w-44 rounded-xl" />
            </div>

            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="border-none premium-shadow bg-white dark:bg-slate-900">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-3 w-28" />
                            <Skeleton className="h-4 w-4 rounded" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-24 mb-2" />
                            <Skeleton className="h-5 w-28 rounded-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Tabla */}
            <Card className="border-none premium-shadow bg-white dark:bg-slate-900">
                {/* Toolbar */}
                <div className="p-4 flex items-center justify-between border-b border-gray-50 dark:border-slate-800">
                    <Skeleton className="h-9 w-64 rounded-xl" />
                    <Skeleton className="h-9 w-32 rounded-xl" />
                </div>
                <div className="p-4 space-y-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="flex items-center gap-4">
                            <Skeleton className="h-12 w-12 rounded-xl flex-shrink-0" />
                            <div className="flex-1 space-y-1.5">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                            <Skeleton className="h-4 w-20 hidden md:block" />
                            <Skeleton className="h-6 w-16 rounded-full hidden md:block" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
