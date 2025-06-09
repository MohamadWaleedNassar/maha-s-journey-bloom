
-- Create a function to update signaling data
CREATE OR REPLACE FUNCTION update_signaling_data(
  call_id UUID,
  data JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.video_calls 
  SET signaling_data = data, updated_at = now()
  WHERE id = call_id;
END;
$$;
