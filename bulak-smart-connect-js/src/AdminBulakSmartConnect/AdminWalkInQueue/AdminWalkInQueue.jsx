import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminWalkInQueue.css';
import NavBar from '../../NavigationComponents/NavSide';
import { queueService } from '../../services/queueService';
import config from '../../config/env.js';
import axios from 'axios';

// Format queue number to WK format - reusing from WalkInQueueAdmin
const formatWKNumber = (queueNumber) => {
  if (typeof queueNumber === 'string' && queueNumber.startsWith('WK')) {
    return queueNumber;
  }
  
  // Handle null or undefined
  if (!queueNumber) return 'WK000';
  
  const numberPart = queueNumber?.includes('-') ? queueNumber.split('-')[1] : queueNumber;
  const num = parseInt(numberPart, 10) || 0;
  return `WK${String(num).padStart(3, '0')}`;
};

const AdminWalkInQueue = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingQueues, setPendingQueues] = useState([]);
  const [currentQueues, setCurrentQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQueue, setSelectedQueue] = useState(null);
  
  // Manual queue states
  const [showManualQueueModal, setShowManualQueueModal] = useState(false);
  const [isCreatingQueue, setIsCreatingQueue] = useState(false);
  const [manualQueueForm, setManualQueueForm] = useState({
    firstName: '',
    lastName: '',
    reasonOfVisit: '',
    phoneNumber: ''
  });
  
  // States for pending count and reset
  const [pendingCount, setPendingCount] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  
  const navigate = useNavigate();

  // Current queue is the first in the serving queues
  const currentQueue = currentQueues.length > 0 ? 
    formatWKNumber(currentQueues[0].queueNumber || currentQueues[0].id) : 'None';
  
  // Next queue is the first in the pending queues
  const nextQueue = pendingQueues.length > 0 ? 
    formatWKNumber(pendingQueues[0].queueNumber || pendingQueues[0].id) : 'None';
  
  // Total queues count
  const totalQueues = pendingQueues.length + currentQueues.length;

  // Print queue ticket function - Direct POS Commands without driver
  const printQueueTicket = async (queueData) => {
    try {
      console.log('Printing ticket for:', queueData);
      
      // Create ESC/POS command sequence
      const createPOSCommands = () => {
        const ESC = '\x1B';
        const GS = '\x1D';
        const LF = '\x0A';
        const CR = '\x0D';
        
        let commands = '';
        
        // Initialize printer
        commands += ESC + '@'; // Initialize printer
        commands += ESC + 't' + '\x00'; // Select character code table (PC437)
        
        // Set line spacing
        commands += ESC + '3' + '\x18'; // Set line spacing to 24 dots
        
        // Header - Center aligned
        commands += ESC + 'a' + '\x01'; // Center align
        commands += ESC + '!' + '\x18'; // Double height + double width
        commands += 'BULAK SMART CONNECT' + LF;
        
        commands += ESC + '!' + '\x00'; // Normal text
        commands += 'Civil Registrar Office' + LF;
        
        // Separator line
        commands += '================================' + LF;
        
        // Queue number - Large and centered
        commands += ESC + 'a' + '\x01'; // Ensure center align
        commands += ESC + '!' + '\x38'; // Triple height + double width
        commands += queueData.queueNumber + LF;
        commands += ESC + '!' + '\x00'; // Reset to normal
        
        // Another separator
        commands += '================================' + LF;
        
        // Details - Left aligned
        commands += ESC + 'a' + '\x00'; // Left align
        commands += `Name: ${queueData.firstName} ${queueData.lastName}` + LF;
        commands += `Service: ${queueData.reasonOfVisit}` + LF;
        commands += `Date: ${queueData.timestamp}` + LF;
        commands += `Time: ${new Date().toLocaleTimeString()}` + LF;
        
        // Separator
        commands += '--------------------------------' + LF;
        
        // Footer - Center aligned
        commands += ESC + 'a' + '\x01'; // Center align
        commands += 'Please wait for your number' + LF;
        commands += 'to be called' + LF + LF;
        commands += 'Thank you!' + LF + LF + LF;
        
        // Cut paper (full cut)
        commands += GS + 'V' + '\x00';
        
        return commands;
      };

      // Method 1: Try Web Serial API (Chrome/Edge)
      if ('serial' in navigator) {
        try {
          console.log('Attempting Web Serial API printing...');
          
          // Request port without vendor filter for broader compatibility
          const port = await navigator.serial.requestPort();
          
          // Open with common POS printer settings
          await port.open({ 
            baudRate: 9600,
            dataBits: 8,
            stopBits: 1,
            parity: 'none',
            flowControl: 'none'
          });
          
          const writer = port.writable.getWriter();
          const commands = createPOSCommands();
          
          // Convert string to Uint8Array for proper binary transmission
          const encoder = new TextEncoder();
          const data = encoder.encode(commands);
          
          await writer.write(data);
          await writer.close();
          await port.close();
          
          console.log('✅ Ticket printed successfully via Web Serial API');
          alert('✅ Ticket printed successfully!');
          return;
          
        } catch (serialError) {
          console.warn('❌ Web Serial API failed:', serialError.message);
        }
      }

      // Method 2: Try Raw Printing via Fetch API (if you have a local print server)
      try {
        console.log('Attempting raw print via local server...');
        
        const commands = createPOSCommands();
        
        // Try sending to a local print server (you'd need to set up a simple Node.js server)
        const response = await fetch(`${config.PRINT.SERVER_URL}/print`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: commands,
            printerName: 'POS-58' // or your printer name
          })
        });
        
        if (response.ok) {
          console.log('✅ Ticket printed via local print server');
          alert('✅ Ticket printed successfully!');
          return;
        }
      } catch (fetchError) {
        console.warn('❌ Local print server not available:', fetchError.message);
      }

      // Method 3: Create downloadable POS file
      try {
        console.log('Creating downloadable POS file...');
        
        const commands = createPOSCommands();
        const blob = new Blob([commands], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `ticket-${queueData.queueNumber}.pos`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('📁 POS file downloaded! Send this file directly to your printer.');
        
      } catch (downloadError) {
        console.warn('❌ File download failed:', downloadError.message);
      }

      // Method 4: Fallback to enhanced browser print with POS-like formatting
      console.log('Using enhanced browser print fallback...');
      
      const printWindow = window.open('', '_blank', 'width=400,height=700');
      printWindow.document.write(`
        <html>
          <head>
            <title>Queue Ticket - ${queueData.queueNumber}</title>
            <style>
              @page {
                size: 58mm auto;
                margin: 0;
              }
              
              body { 
                font-family: 'Courier New', monospace; 
                font-size: 11px;
                line-height: 1.2;
                margin: 0;
                padding: 2mm;
                width: 54mm;
                background: white;
                color: black;
              }
              
              .center { text-align: center; }
              .left { text-align: left; }
              
              .header { 
                font-size: 12px; 
                font-weight: bold; 
                margin-bottom: 3px;
              }
              
              .queue-number { 
                font-size: 24px; 
                font-weight: bold; 
                margin: 8px 0;
                padding: 5px;
                border: 1px solid #000;
                background: #f0f0f0;
              }
              
              .separator {
                border-top: 1px dashed #000;
                margin: 5px 0;
                height: 1px;
              }
              
              .details {
                font-size: 10px;
                margin: 3px 0;
              }
              
              .footer {
                margin-top: 10px;
                font-size: 10px;
              }
              
              .no-print { 
                margin-top: 15px;
                text-align: center;
              }
              
              .no-print button {
                margin: 3px;
                padding: 8px 12px;
                font-size: 11px;
                cursor: pointer;
                border: 1px solid #333;
                background: #f5f5f5;
              }
              
              .no-print .print-btn {
                background: #4CAF50;
                color: white;
                font-weight: bold;
              }
              
              .instructions {
                background: #fffacd;
                padding: 8px;
                margin: 10px 0;
                border: 1px solid #ddd;
                border-radius: 3px;
                font-size: 10px;
              }
              
              @media print {
                .no-print, .instructions { display: none !important; }
                body { width: auto; }
                .queue-number { font-size: 20px; }
              }
            </style>
          </head>
          <body>
            <div class="center">
              <div class="header">BULAK SMART CONNECT</div>
              <div>Civil Registrar Office</div>
            </div>
            
            <div class="separator"></div>
            
            <div class="center">
              <div class="queue-number">${queueData.queueNumber}</div>
            </div>
            
            <div class="separator"></div>
            
            <div class="left">
              <div class="details">Name: ${queueData.firstName} ${queueData.lastName}</div>
              <div class="details">Service: ${queueData.reasonOfVisit}</div>
              <div class="details">Date: ${queueData.timestamp}</div>
              <div class="details">Time: ${new Date().toLocaleTimeString()}</div>
            </div>
            
            <div class="separator"></div>
            
            <div class="center footer">
              Please wait for your number<br>
              to be called<br><br>
              Thank you!
            </div>
            
            <div class="instructions no-print">
              <strong>🖨️ Printing Instructions:</strong><br>
              1. Click "Print Ticket" below<br>
              2. Select your POS/Thermal printer<br>
              3. Set paper size to 58mm (2.28")<br>
              4. Choose "More settings" → "Options" → "Headers and footers" OFF
            </div>
            
            <div class="no-print">
              <button class="print-btn" onclick="window.print();">🖨️ Print Ticket</button>
              <button onclick="window.close();">❌ Close</button><br><br>
              <button onclick="downloadPOS();">📁 Download POS File</button>
            </div>
            
            <script>
              // Auto-print after 1 second
              setTimeout(() => window.print(), 1000);
              
              // Download POS file function
              function downloadPOS() {
                const posCommands = '${createPOSCommands().replace(/\\/g, '\\\\').replace(/'/g, "\\'")}';
                const blob = new Blob([posCommands], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'ticket-${queueData.queueNumber}.pos';
                a.click();
                URL.revokeObjectURL(url);
                alert('POS file downloaded! Send directly to printer.');
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      
    } catch (error) {
      console.error('❌ All printing methods failed:', error);
      
      // Final fallback - show ticket info
      const ticketText = `
🎫 BULAK SMART CONNECT
   Civil Registrar Office
   
   ${queueData.queueNumber}
   
   Name: ${queueData.firstName} ${queueData.lastName}
   Service: ${queueData.reasonOfVisit}
   Date: ${queueData.timestamp}
   Time: ${new Date().toLocaleTimeString()}
   
   Please wait for your number to be called
   Thank you!
    `;
    
      alert('⚠️ Automatic printing failed. Here\'s your ticket info:\n' + ticketText);
    }
  };

  // Manual queue creation function
  const createManualQueue = async (guestData = null) => {
    setIsCreatingQueue(true);
    try {
      const queueData = guestData || {
        firstName: 'Walk-in',
        lastName: 'Guest',
        middleInitial: '',
        reasonOfVisit: 'General Inquiry',
        address: 'N/A',
        phoneNumber: 'N/A'
      };

      console.log('Creating manual queue with data:', queueData);

      // Create queue via API
      const response = await queueService.createManualQueue(queueData);
      console.log('Manual queue created:', response);

      const queueNumber = formatWKNumber(response.queue.queueNumber || response.queue.id);
      
      // Print the ticket
      await printQueueTicket({
        queueNumber,
        firstName: queueData.firstName,
        lastName: queueData.lastName,
        reasonOfVisit: queueData.reasonOfVisit,
        timestamp: new Date().toLocaleDateString()
      });

      // Refresh queue data
      await fetchQueueData();
      
      alert(`Queue ${queueNumber} created successfully!`);
      setShowManualQueueModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating manual queue:', error);
      console.error('Error response:', error.response?.data); 
      console.error('Error status:', error.response?.status); 
    
      if (error.response?.status === 401) {
        alert('Authentication failed. Please log in again.');
        navigate('/login');
      } else {
        // More detailed error message
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error || 
                            error.message;
        alert(`Failed to create queue: ${errorMessage}`);
      }
    } finally {
      setIsCreatingQueue(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setManualQueueForm({
      firstName: '',
      lastName: '',
      reasonOfVisit: '',
      phoneNumber: ''
    });
  };

  // Handle form input changes
  const handleFormChange = (field, value) => {
    setManualQueueForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Hotkey handler for Ctrl+Q
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'q') {
        event.preventDefault();
        setShowManualQueueModal(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Update queue status
  const updateQueueStatus = async (queueId, newStatus) => {
    try {
      console.log(`Attempting to update queue ${queueId} to status: ${newStatus}`);
      
      // Parse the queueId if it's not already a number
      const parsedQueueId = parseInt(queueId, 10) || queueId;
      
      // Make API call to update status using queueService
      await queueService.updateQueueStatus(parsedQueueId, newStatus);
      
      console.log(`Queue status updated successfully: ${queueId} → ${newStatus}`);
      
      // Update local state based on new status
      if (newStatus === 'serving' || newStatus === 'in-progress') {
        // Make sure we use consistent status naming when updating UI
        const mappedStatus = 'serving'; // NestJS backend uses 'serving'
        
        // Move from pending to current
        const queueToMove = pendingQueues.find(q => q.id === queueId || q.id === parsedQueueId);
        if (queueToMove) {
          setPendingQueues(prev => prev.filter(q => q.id !== queueId && q.id !== parsedQueueId));
          setCurrentQueues(prev => [...prev, {...queueToMove, status: mappedStatus}]);
          
          // Set selected queue to show details
          setSelectedQueue({...queueToMove, status: mappedStatus});
          
          // Navigate to details view
          navigate(`/AdminWalkInDetails/${queueId}`);
        }
      } else if (newStatus === 'completed') {
        // Remove from current
        setCurrentQueues(prev => prev.filter(q => q.id !== queueId && q.id !== parsedQueueId));
        // Clear selected queue if it was completed
        if (selectedQueue && (selectedQueue.id === queueId || selectedQueue.id === parsedQueueId)) {
          setSelectedQueue(null);
        }
      } else if (newStatus === 'pending') {
        // Move from current to pending
        const queueToMove = currentQueues.find(q => q.id === queueId || q.id === parsedQueueId);
        if (queueToMove) {
          setCurrentQueues(prev => prev.filter(q => q.id !== queueId && q.id !== parsedQueueId));
          setPendingQueues(prev => [...prev, {...queueToMove, status: 'pending'}]);
        }
      }
      
      // Refresh data after updating with a slight delay to ensure backend has processed the change
      setTimeout(() => fetchQueueData(), 500);
    } catch (error) {
      console.error('Failed to update queue status:', error);
      console.error('Error details:', error.response?.data || error.message);
      alert(`Failed to update queue status. Error: ${error.response?.data?.message || error.message}`);
    }
  };
  
  // Function to fetch queue data - using queueService.fetchWalkInQueues
  const fetchQueueData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all walk-in queues (includes both pending and serving)
      const walkInQueues = await queueService.fetchWalkInQueues();
      
      // Separate into pending and current queues
      const formattedPendingQueues = walkInQueues
        .filter(queue => queue.status === 'pending')
        .map(queue => ({
          id: queue.id,
          queueNumber: formatWKNumber(queue.queueNumber || queue.id),
          firstName: queue.firstName || 'Guest',
          lastName: queue.lastName || '',
          reasonOfVisit: queue.reasonOfVisit || 'General Inquiry',
          status: 'pending',
          timestamp: queue.createdAt || new Date().toISOString()
        }));
      
      const formattedCurrentQueues = walkInQueues
        .filter(queue => queue.status === 'serving')
        .map(queue => ({
          id: queue.id,
          queueNumber: formatWKNumber(queue.queueNumber || queue.id),
          firstName: queue.firstName || 'Guest',
          lastName: queue.lastName || '',
          reasonOfVisit: queue.reasonOfVisit || 'General Inquiry',
          status: 'serving',
          timestamp: queue.createdAt || new Date().toISOString()
        }));
      
      setPendingQueues(formattedPendingQueues);
      setCurrentQueues(formattedCurrentQueues);
      setError(null);
    } catch (err) {
      console.error('Error fetching queue data:', err);
      setError('Failed to load queue data. Please ensure the server is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch pending count
  const fetchPendingCount = async () => {
    try {
      const data = await queueService.getTodayPendingCount();
      setPendingCount(data.pendingCount);
    } catch (error) {
      console.error('Error fetching pending count:', error);
    }
  };

  // Manual reset handler
  const handleManualReset = async () => {
    if (!window.confirm('⚠️ This will cancel ALL pending queues for today. Are you sure?')) {
      return;
    }

    setIsResetting(true);
    try {
      const result = await queueService.triggerManualReset();
      alert(`✅ Daily reset completed! ${result.message}`);
      await fetchQueueData(); // Refresh the queue data
    } catch (error) {
      console.error('Error during manual reset:', error);
      alert('❌ Failed to perform daily reset. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  // View details of a specific queue
  const viewQueueDetails = (queueId) => {
    navigate(`/AdminWalkInDetails/${queueId}`);
  };
  
  // Get all queues combined for rendering
  const getAllQueues = () => {
    return [...currentQueues, ...pendingQueues];
  };
  
  // Fetch data on component mount and refresh periodically
  useEffect(() => {
    fetchQueueData();
    fetchPendingCount(); // Fetch pending count on mount
    
    // Auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      fetchQueueData();
      fetchPendingCount();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [fetchQueueData]);

  return (
    <div className="admin-walkin-queue">
      {/* Header Bar */}
      <div className="admin-walkin-queue-header-bar">
        <button
          className="admin-walkin-queue-menu-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation"
        >
          <span className="admin-walkin-queue-menu-icon">
            <span className="admin-walkin-queue-menu-bar"></span>
            <span className="admin-walkin-queue-menu-bar"></span>
            <span className="admin-walkin-queue-menu-bar"></span>
          </span>
        </button>
        <h1 className="admin-walkin-queue-header-title">Walk - in</h1>
        
        {/* Manual Queue Button */}
        <button
          className="manual-queue-btn"
          onClick={() => setShowManualQueueModal(true)}
          title="Create Manual Queue (Ctrl+Q)"
        >
          + Manual Queue
        </button>
        
        {/* Manual Reset Button - New Feature */}
        <button
          className="manual-reset-btn"
          onClick={handleManualReset}
          disabled={isResetting || pendingCount === 0}
          title="Cancel all pending queues for today"
          style={{
            position: 'absolute',
            right: '200px', // Adjust position
            top: '50%',
            transform: 'translateY(-50%)',
            background: pendingCount > 0 ? 'linear-gradient(135deg, #dc3545, #c82333)' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 18px',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: pendingCount > 0 ? 'pointer' : 'not-allowed',
          }}
        >
          {isResetting ? 'Resetting...' : `🔄 Daily Reset (${pendingCount} pending)`}
        </button>
      </div>

      {/* Sidebar */}
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="admin-walkin-queue-main">
        {/* Summary Cards */}
        <div className="admin-walkin-queue-summary-row">
          <div className="admin-walkin-queue-summary-card">
            <h2 className="admin-walkin-queue-summary-title">CURRENT QUEUE</h2>
            <div className="admin-walkin-queue-summary-number">{currentQueue}</div>
            <div className="admin-walkin-queue-summary-next">
              Next on Queue <span className="admin-walkin-queue-summary-next-number">{nextQueue}</span>
            </div>
          </div>
          <div className="admin-walkin-queue-summary-card gray">
            <h2 className="admin-walkin-queue-summary-title">TOTAL NUMBER OF QUEUE</h2>
            <div className="admin-walkin-queue-summary-number">{totalQueues}</div>
          </div>
        </div>

        {/* Walk-In Queues List */}
        <div className="admin-walkin-queue-list-section">
          <h2 className="admin-walkin-queue-list-title">Walk - In Queues</h2>
          
          <div className="queue-content">
            {loading ? (
              <div className="queue-loading">
                <div className="loading-spinner"></div>
                <p>Loading queue data...</p>
              </div>
            ) : error ? (
              <div className="queue-error">
                <p>{error}</p>
              </div>
            ) : getAllQueues().length === 0 ? (
              <div className="queue-empty">
                <p>No active walk-in queue</p>
                <small>When citizens create walk-in appointments, they'll appear here.</small>
              </div>
            ) : (
              <div className="queue-list">
                {getAllQueues().slice(0, 5).map(queue => (
                  <div 
                    key={queue.id} 
                    className={`queue-item ${queue.status === 'serving' ? 'active-queue' : ''}`}
                  >
                    <div className="queue-top">
                      <div className="queue-numberwalk">{queue.queueNumber}</div>
                      <div className={`queue-status ${queue.status}`}>
                        {queue.status === 'serving' ? 'in-progress' : queue.status}
                      </div>
                    </div>
                    <div className="queue-details">
                      <div className="queue-name">{`${queue.firstName} ${queue.lastName}`}</div>
                      <div className="queue-reason">{queue.reasonOfVisit}</div>
                    </div>
                    <div className="queue-actions">
                      {queue.status === 'pending' && (
                        <button 
                          className="queue-action-btn start"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQueueStatus(queue.id, 'serving');
                          }}
                          aria-label="Start serving this client"
                        >
                          Start
                        </button>
                      )}
                      {queue.status === 'serving' && (
                        <>
                          <button 
                            className="queue-action-btn view"
                            onClick={(e) => {
                              e.stopPropagation();
                              viewQueueDetails(queue.id);
                            }}
                            aria-label="View details of this client"
                          >
                            View Details
                          </button>
                          <button 
                            className="queue-action-btn complete"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQueueStatus(queue.id, 'completed');
                            }}
                            aria-label="Mark this appointment as completed"
                          >
                            Complete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manual Queue Modal */}
      {showManualQueueModal && (
        <div className="modal-overlay" onClick={() => setShowManualQueueModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Manual Queue</h3>
              <button 
                className="modal-close"
                onClick={() => setShowManualQueueModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <p>Create a queue for walk-in guest users and print the ticket.</p>
              
              <div className="queue-options">
                <button
                  className="quick-queue-btn"
                  onClick={() => createManualQueue()}
                  disabled={isCreatingQueue}
                >
                  {isCreatingQueue ? 'Creating...' : '🎫 Quick Queue (Default Guest)'}
                </button>
                
                <div className="or-divider">or</div>
                
                <div className="custom-form">
                  <h4>Custom Queue Details</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name:</label>
                      <input
                        type="text"
                        value={manualQueueForm.firstName}
                        onChange={(e) => handleFormChange('firstName', e.target.value)}
                        placeholder="Walk-in"
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name:</label>
                      <input
                        type="text"
                        value={manualQueueForm.lastName}
                        onChange={(e) => handleFormChange('lastName', e.target.value)}
                        placeholder="Guest"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Reason of Visit:</label>
                    <select
                      value={manualQueueForm.reasonOfVisit}
                      onChange={(e) => handleFormChange('reasonOfVisit', e.target.value)}
                    >
                      <option value="">Select reason...</option>
                      <option value="Birth Certificate">Birth Certificate</option>
                      <option value="Marriage Certificate">Marriage Certificate</option>
                      <option value="Death Certificate">Death Certificate</option>
                      <option value="CENOMAR">CENOMAR</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Document Correction">Document Correction</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Phone Number (Optional):</label>
                    <input
                      type="tel"
                      value={manualQueueForm.phoneNumber}
                      onChange={(e) => handleFormChange('phoneNumber', e.target.value)}
                      placeholder="N/A"
                    />
                  </div>
                  
                  <button
                    className="custom-queue-btn"
                    onClick={() => createManualQueue({
                      firstName: manualQueueForm.firstName || 'Walk-in',
                      lastName: manualQueueForm.lastName || 'Guest',
                      reasonOfVisit: manualQueueForm.reasonOfVisit || 'General Inquiry',
                      phoneNumber: manualQueueForm.phoneNumber || 'N/A',
                      address: 'N/A',
                      middleInitial: ''
                    })}
                    disabled={isCreatingQueue}
                  >
                    {isCreatingQueue ? 'Creating...' : '🎫 Create Custom Queue'}
                  </button>
                </div>
              </div>
              
              <div className="modal-footer">
                <small>
                  <strong>Hotkey:</strong> Press Ctrl+Q to open this dialog<br/>
                  <strong>Printer:</strong> XPrinter POS 58 thermal printer supported<br/>
                  <strong>Security:</strong> Only authenticated admins can create manual queues
                </small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWalkInQueue;