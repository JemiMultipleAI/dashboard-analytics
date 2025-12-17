'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { fetchSheetsData } from '@/lib/api';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, FileSpreadsheet, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function SheetsDashboard() {
  const [sheetId, setSheetId] = useState('');
  const [activeTab, setActiveTab] = useState('column1');
  const [columns, setColumns] = useState({
    column1: [] as string[],
    column2: [] as string[],
    column3: [] as string[],
    column4: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isWebhookLoading, setIsWebhookLoading] = useState(false);

  // Load sheet ID from localStorage on mount
  useEffect(() => {
    const savedSheetId = localStorage.getItem('google_sheet_id');
    if (savedSheetId) {
      setSheetId(savedSheetId);
    }
  }, []);

  const handleLoadSheet = async (sheetIdOrUrl?: string) => {
    const idToUse = sheetIdOrUrl || sheetId;
    
    if (!idToUse.trim()) {
      toast.error('Please enter a Google Sheet ID');
      return;
    }

    setLoading(true);
    try {
      // Extract sheet ID from URL if full URL is provided
      let extractedSheetId = idToUse;
      if (idToUse.includes('/spreadsheets/d/')) {
        const match = idToUse.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
        if (match) {
          extractedSheetId = match[1];
        }
      }

      const data = await fetchSheetsData(extractedSheetId);
      console.log("sheet data", data);
      
      setColumns(data.columns || {
        column1: [],
        column2: [],
        column3: [],
        column4: [],
      });
      
      setIsLoaded(true);
      localStorage.setItem('google_sheet_id', extractedSheetId);
      toast.success('Sheet loaded successfully');
    } catch (error: any) {
      console.error('Error loading sheet:', error);
      toast.error(error.message || 'Failed to load sheet');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerWebhook = async () => {
    console.log('triggered');
    setIsWebhookLoading(true);
    try {
      // const response = await fetch('/api/webhook', {
      //   method: 'GET',
      // });

      // const data = await response.json();

      // if (data.success) {
      //   toast.success('Webhook triggered successfully!');
      // } else {
      //   toast.error('Failed to trigger webhook');
      // }

      // Wait 7 seconds, then automatically load the sheet
      // toast.info('Loading sheet in 7 seconds...');
      setTimeout(async () => {
        const sheetUrl = 'https://docs.google.com/spreadsheets/d/11Ar45A5gR_EdZ9zjJJyMNPo6EVHJmQX-ErjsDX-_BLQ/edit?gid=0#gid=0';
        await handleLoadSheet(sheetUrl);
      }, 1000);
    } catch (error) {
      console.error('Error triggering webhook:', error);
      toast.error('Error triggering webhook');
    } finally {
      setIsWebhookLoading(false);
    }
  };

  const renderColumnContent = (columnData: string[]) => {
    if (columnData.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No data in this column
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {columnData.map((value, index) => (
          <div
            key={index}
            className="p-3 bg-card border border-border rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <span className="text-sm text-foreground whitespace-pre-wrap break-words">
              {value || '(empty)'}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout title="Smart SEO">
      <div className="space-y-6">
        {/* Webhook Trigger Section */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Send className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">SEO Magic</h2>
              <p className="text-sm text-muted-foreground">Initiate the magic</p>
            </div>
          </div>
          <Button
            onClick={handleTriggerWebhook}
            disabled={isWebhookLoading}
            className="gradient-primary text-primary-foreground hover:opacity-90"
          >
            {isWebhookLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Initiating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Initiate
              </>
            )}
          </Button>
        </div>


        {/* Tabs with Column Data */}
        {isLoaded && (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex">
                {/* Left Side Tabs */}
                <TabsList className="flex flex-col h-auto w-48 bg-secondary/50 border-r border-border rounded-none rounded-l-lg p-2 space-y-1">
                  <TabsTrigger
                    value="column1"
                    className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {columns.column1[0] || 'Column 1'}
                  </TabsTrigger>
                  <TabsTrigger
                    value="column2"
                    className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {columns.column2[0] || 'Column 1'}
                  </TabsTrigger>
                  <TabsTrigger
                    value="column3"
                    className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {columns.column3[0] || 'Column 1'}
                  </TabsTrigger>
                  <TabsTrigger
                    value="column4"
                    className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {columns.column4[0] || 'Column 1'}
                  </TabsTrigger>
                </TabsList>

                {/* Content Area */}
                <div className="flex-1">
                  <TabsContent value="column1" className="mt-0 h-full">
                    <ScrollArea className="h-[calc(100vh-300px)] p-6">
                      {renderColumnContent(columns.column1)}
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="column2" className="mt-0 h-full">
                    <ScrollArea className="h-[calc(100vh-300px)] p-6">
                      {renderColumnContent(columns.column2)}
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="column3" className="mt-0 h-full">
                    <ScrollArea className="h-[calc(100vh-300px)] p-6">
                      {renderColumnContent(columns.column3)}
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="column4" className="mt-0 h-full">
                    <ScrollArea className="h-[calc(100vh-300px)] p-6">
                      {renderColumnContent(columns.column4)}
                    </ScrollArea>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </div>
        )}

        {!isLoaded && (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Sheet Loaded</h3>
            <p className="text-muted-foreground">
              Enter a Google Sheet ID or URL above and click "Load Sheet" to view columns
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

