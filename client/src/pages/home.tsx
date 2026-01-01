import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { CalendarIcon, Heart, Sparkles, Share2 } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import HeartParticles from '@/components/HeartParticles';

const formSchema = z.object({
  partnerName: z.string().min(2, "Partner's name is required"),
  partnerDob: z.date().optional(),
  message: z.string().min(10, "Please write a heartfelt message (min 10 chars)"),
});

export default function Home() {
  const [_, setLocation] = useLocation();
  const [shareLink, setShareLink] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partnerName: "",
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Create query string
    const params = new URLSearchParams();
    params.append('name', values.partnerName);
    if (values.partnerDob) {
      params.append('dob', values.partnerDob.toISOString());
    }
    params.append('message', values.message);
    
    // In a real app we might save this to a DB and get an ID.
    // Here we just construct the URL for the preview.
    const url = `/proposal?${params.toString()}`;
    setLocation(url);
  };

  const generateLink = () => {
    const values = form.getValues();
    if (!values.partnerName || !values.message) {
      form.trigger();
      return;
    }
    const params = new URLSearchParams();
    params.append('name', values.partnerName);
    if (values.partnerDob) {
      params.append('dob', values.partnerDob.toISOString());
    }
    params.append('message', values.message);
    
    const baseUrl = window.location.origin;
    setShareLink(`${baseUrl}/proposal?${params.toString()}`);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-50 via-pink-50 to-white dark:from-red-950 dark:via-black dark:to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <HeartParticles />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md z-10"
      >
        <Card className="glass-card border-none shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
              className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 text-primary"
            >
              <Heart className="w-8 h-8 fill-current" />
            </motion.div>
            <CardTitle className="font-serif text-3xl font-medium tracking-wide">Forever & Always</CardTitle>
            <CardDescription className="text-muted-foreground font-sans">
              Create a magical proposal experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <FormField
                  control={form.control}
                  name="partnerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Who is this for?</FormLabel>
                      <FormControl>
                        <Input placeholder="Partner's Name" {...field} className="bg-white/50 border-pink-200 focus:border-pink-500" data-testid="input-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Write something from your heart..." 
                          className="resize-none min-h-[100px] bg-white/50 border-pink-200 focus:border-pink-500" 
                          {...field} 
                          data-testid="input-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1 border-primary/20 hover:bg-primary/5" onClick={() => {
                    generateLink();
                    if (shareLink) {
                      navigator.clipboard.writeText(shareLink);
                      alert("Link copied to clipboard! Send this to her.");
                    }
                  }} data-testid="btn-share">
                    <Share2 className="w-4 h-4 mr-2" />
                    Copy Link for Her
                  </Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25" data-testid="btn-preview">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Preview Proposal
                  </Button>
                </div>

                {shareLink && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 bg-secondary/20 rounded-lg text-xs break-all border border-secondary/50 text-secondary-foreground mt-4"
                  >
                    <p className="font-semibold mb-1">Share this link:</p>
                    {shareLink}
                  </motion.div>
                )}

              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}