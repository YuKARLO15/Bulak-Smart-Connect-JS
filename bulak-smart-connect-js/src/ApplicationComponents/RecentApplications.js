
const SampleApplication = [
    {
      id: "1",
      type: "Birth Certificate",
      status: "Approved",
      date: "01/13/25",
      message: "Document is ready for pick up",
    },
    {
      id: "2",
      type: "Marriage Certificate",
      status: "Pending",
      date: "01/13/25",
      message: "Waiting for admin approval",
    },
    {
      id: "3",
      type: "Marriage Certificate",
      status: "Declined",
      date: "01/13/25",
      message: "Additional Documents Required",
    }
  ];
  

  export const fetchApplications = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(SampleApplication);
      }, 1000);
    });
  };
  