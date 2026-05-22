import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CategoriesLoading() {
    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="space-y-2">
                <Skeleton className="h-9 w-48" />
                <Skeleton className="h-4 w-96" />
            </div>

            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2].map((i) => (
                    <Card key={i} className="border-none premium-shadow bg-white dark:bg-slate-900">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-3 w-28" />
                            <Skeleton className="h-4 w-4 rounded" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-5 w-24 rounded-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Tabla */}
            <Card className="border-none premium-shadow bg-white dark:bg-slate-900">
                {/* Toolbar */}
                <div className="p-4 flex items-center justify-between border-b border-gray-50 dark:border-slate-800">
                    <Skeleton className="h-9 w-64 rounded-xl" />
                    <Skeleton className="h-9 w-36 rounded-xl" />
                </div>
                <div className="p-4 space-y-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="flex-1 space-y-1.5">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-6 w-16 rounded-full hidden md:block" />
                            <Skeleton className="h-6 w-16 rounded-full hidden md:block" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
