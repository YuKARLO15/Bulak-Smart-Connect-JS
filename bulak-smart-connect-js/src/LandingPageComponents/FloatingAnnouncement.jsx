import React, { useState, useEffect } from "react";
import { Fab, Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Badge } from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";
import CloseIcon from "@mui/icons-material/Close";
import { announcementService } from "../services/announcementService";
import "./FloatingAnnouncement.css";

const LOCAL_STORAGE_KEY = "SeenAnnouncementIdsFab";

const FloatingAnnouncementFab = () => {
  const [open, setOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unseenCount, setUnseenCount] = useState(0);


  const getSeenIds = () => {
    const ids = localStorage.getItem(LOCAL_STORAGE_KEY);
    return ids ? JSON.parse(ids) : [];
  };


  const setSeenIds = (ids) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ids));
  };

 
  useEffect(() => {
    setLoading(true);
    announcementService
      .getRecentAnnouncements(20)
      .then((data) => {
        setAnnouncements(data);
        setError(null);

        // Calculate unseen count
        const seenIds = getSeenIds();
        const unseen = data.filter((a) => !seenIds.includes(a.id));
        setUnseenCount(unseen.length);
      })
      .catch(() => {
        setError("Failed to load announcements");
        setAnnouncements([]);
        setUnseenCount(0);
      })
      .finally(() => setLoading(false));
  }, [open]);


  useEffect(() => {
    if (open && announcements.length > 0) {
      const ids = announcements.map((a) => a.id);
      setSeenIds(ids);
      setUnseenCount(0);
    }
    
  }, [open]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <>
      <Badge
        badgeContent={unseenCount}
        color="error"
        overlap="circular"
        className="BadgeFab"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Fab
          color="primary"
          aria-label="announcements"
          onClick={() => setOpen(true)}
          className="FabButtonFab"
        >
          <CampaignIcon />
        </Fab>
      </Badge>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          className: "DialogFab",
        }}
      >
        <DialogTitle className="DialogTitleFab">
          <span>Announcements</span>
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            size="small"
            sx={{ color: "#fff" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="DialogContentFab" dividers>
          {loading ? (
            <Box className="CenteredFab">
              <Typography variant="body2" color="text.secondary">
                Loading announcements...
              </Typography>
            </Box>
          ) : error ? (
            <Box className="CenteredFab">
              <Typography color="error">{error}</Typography>
            </Box>
          ) : announcements.length === 0 ? (
            <Box className="CenteredFab">
              <Typography>No announcements at the moment.</Typography>
            </Box>
          ) : (
            <Box className="AnnouncementListFab">
              {announcements.map((announcement) => (
                <Box className="AnnouncementItemFab" key={announcement.id}>
                  <Typography variant="subtitle2" className="AnnouncementTitleFab">
                    {announcement.title}
                  </Typography>
                  <Typography variant="body2" className="AnnouncementDescriptionFab">
                    {announcement.description}
                  </Typography>
                  {announcement.image && (
                    <img
                      src={announcement.image}
                      alt="Announcement"
                      className="AnnouncementImageFab"
                    />
                  )}
                  <Typography variant="caption" className="AnnouncementDateFab">
                    Posted: {formatDate(announcement.createdAt)}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingAnnouncementFab;