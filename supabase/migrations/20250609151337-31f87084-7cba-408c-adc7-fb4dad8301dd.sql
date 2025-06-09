
-- Create memories table for gallery functionality
CREATE TABLE public.memories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  notes TEXT,
  created_by TEXT NOT NULL DEFAULT 'patient', -- 'patient' or 'admin'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- 'info', 'success', 'warning', 'urgent'
  read_status BOOLEAN NOT NULL DEFAULT false,
  sent_by TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create video call sessions table
CREATE TABLE public.video_calls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'waiting', -- 'waiting', 'active', 'ended'
  started_by TEXT NOT NULL, -- 'patient' or 'admin'
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_calls ENABLE ROW LEVEL SECURITY;

-- Create policies for memories (open access for simplicity)
CREATE POLICY "Allow all operations on memories" ON public.memories FOR ALL USING (true);

-- Create policies for notifications (open access for simplicity)  
CREATE POLICY "Allow all operations on notifications" ON public.notifications FOR ALL USING (true);

-- Create policies for video calls (open access for simplicity)
CREATE POLICY "Allow all operations on video calls" ON public.video_calls FOR ALL USING (true);

-- Create storage bucket for memory images
INSERT INTO storage.buckets (id, name, public) VALUES ('memories', 'memories', true);

-- Create storage policy for memories bucket
CREATE POLICY "Allow all operations on memories bucket" ON storage.objects FOR ALL USING (bucket_id = 'memories');
