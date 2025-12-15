'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { fetchSheetsData } from '@/lib/api';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, FileSpreadsheet } from 'lucide-react';
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

  // Load sheet ID from localStorage on mount
  useEffect(() => {
    const savedSheetId = localStorage.getItem('google_sheet_id');
    if (savedSheetId) {
      setSheetId(savedSheetId);
    }
  }, []);

  const handleLoadSheet = async () => {
    if (!sheetId.trim()) {
      toast.error('Please enter a Google Sheet ID');
      return;
    }

    setLoading(true);
    try {
      // Extract sheet ID from URL if full URL is provided
      let extractedSheetId = sheetId;
      if (sheetId.includes('/spreadsheets/d/')) {
        const match = sheetId.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
        if (match) {
          extractedSheetId = match[1];
        }
      }

      const data = await fetchSheetsData(extractedSheetId);
      
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
    <DashboardLayout title="Google Sheets">
      <div className="space-y-6">
        {/* Sheet ID Input */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label htmlFor="sheet-id" className="block text-sm font-medium mb-2">
                Google Sheet ID or URL
              </label>
              <Input
                id="sheet-id"
                type="text"
                placeholder="Enter Sheet ID or full URL"
                value={sheetId}
                onChange={(e) => setSheetId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLoadSheet();
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Example: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
              </p>
            </div>
            <Button
              onClick={handleLoadSheet}
              disabled={loading || !sheetId.trim()}
              className="min-w-[120px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Load Sheet
                </>
              )}
            </Button>
          </div>
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
                    Column 1
                  </TabsTrigger>
                  <TabsTrigger
                    value="column2"
                    className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Column 2
                  </TabsTrigger>
                  <TabsTrigger
                    value="column3"
                    className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Column 3
                  </TabsTrigger>
                  <TabsTrigger
                    value="column4"
                    className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Column 4
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

