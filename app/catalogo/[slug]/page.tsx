import { getStoreData } from "@/app/actions/store";
import { notFound } from "next/navigation";
import { StoreView } from "./store-view";

export default async function CatalogPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const data = await getStoreData(slug);

    if (data.error || !data.organization) {
        notFound();
    }

    return (
        <StoreView
            organization={data.organization}
            products={data.products}
            categories={data.categories}
        />
    );
}
