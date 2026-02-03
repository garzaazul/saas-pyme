-- Migration: Enable Public Access for Storage Buckets
-- Allows anonymous users (unauthenticated) to view images in the 'products' bucket

-- 1. Ensure 'products' bucket is public (optional if policies are used, but good practice)
-- UPDATE storage.buckets SET public = true WHERE id = 'products';

-- 2. Policy: Allow public SELECT access to objects in 'products' bucket
-- Note: We check if the policy exists before creating it to avoid errors during re-runs
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Public Access to Product Images'
    ) THEN
        CREATE POLICY "Public Access to Product Images"
        ON storage.objects FOR SELECT
        USING ( bucket_id = 'products' );
    END IF;
END $$;
