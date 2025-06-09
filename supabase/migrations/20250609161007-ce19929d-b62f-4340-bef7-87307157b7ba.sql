
-- Add signaling_data column to video_calls table to store WebRTC signaling information
ALTER TABLE public.video_calls 
ADD COLUMN signaling_data jsonb NULL;

-- Add a comment to explain the column purpose
COMMENT ON COLUMN public.video_calls.signaling_data IS 'Stores WebRTC signaling data including offers, answers, and ICE candidates';
