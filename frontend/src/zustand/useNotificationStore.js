import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const useNotificationStore = create((set, get) => {
  return {
    notifications: [],
    selectedNotification: null,
    selectedRequest: null,
    rejectionReason: null,
    pendingReason: null,
    requests: [],
 
    fetchNotifications: async (userId, role) => {
      try {
        const res = await axios.post(`/api/notification/get_notification`, {
          userId,
          role,
        });
        set({
          notifications: res.data.notifications,
          requests: res.data.requests,
        });

        const { selectedNotification, selectedRequest } = get();

        if (selectedNotification) {
          const updatedNotification = res.data.notifications.find(
            (notif) => notif._id === selectedNotification._id
          );
          set({ selectedNotification: updatedNotification || null });
        }
        if (selectedRequest) {
          const updatedRequest = res.data.requests.find(
            (req) => req._id === selectedRequest._id
          );
          set({ selectedRequest: updatedRequest || null });
        }
      } catch (error) {
        // console.log("Error : ",error)
        toast.error(
          error.response?.data?.error || "Failed to fetch notifications"
        );
      }
    },

    viewNotification: (notification) =>
      set({ selectedNotification: notification }),
    viewRequest: (req) => set({ selectedRequest: req }),
    changeNotificationStatus: async (notId, role) => {
      try {
        await axios.post(`/api/notification/update_status`, { notId, role });
      } catch (error) {
        toast.error(
          error.response?.data?.error || "Failed to fetch notifications"
        );
      }
    },
    assetReject: async (userId, reason) => {
      try {
        const { selectedRequest } = get();
        await axios.post(`/api/notification/asset_reject`, {
          requestId: selectedRequest._id,
          requested_by: selectedRequest.requested_by,
          reason,
          rejected_by: userId,
        });
        await get().fetchNotifications(userId);
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to reject request");
      }
    },
    softwareReject: async (userId, reason) => {
      try {
        const { selectedRequest } = get();
        await axios.post(`/api/notification/software_reject`, {
          requestId: selectedRequest._id,
          requested_by: selectedRequest.requested_by,
          reason,
          rejected_by: userId,
        });
        await get().fetchNotifications(userId);
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to reject request");
      }
    },
    assetPending: async (userId, reason) => {
      try {
        const { selectedRequest } = get();
        await axios.post(`/api/notification/asset_pending`, {
          requestId: selectedRequest._id,
          requested_by: selectedRequest.requested_by,
          reason,
          pending_by: userId,
        });
        await get().fetchNotifications(userId);
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to reject request");
      }
    },
    softwarePending: async (userId, reason) => {
      try {
        const { selectedRequest } = get();
        await axios.post(`/api/notification/software_pending`, {
          requestId: selectedRequest._id,
          requested_by: selectedRequest.requested_by,
          reason,
          pending_by: userId,
        });
        await get().fetchNotifications(userId);
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to reject request");
      }
    },
    sendNotification: async (userId, notification, type) => {
      try {
        const { selectedRequest } = get();
        await axios.post(`/api/notification/send_notification`, {
          requestId: selectedRequest._id,
          requested_by: selectedRequest.requested_by,         
          notification,                                                                                  
          type,                                                 
          reviewed_by: userId,
        });         
        await get().fetchNotifications(userId);
      } catch (error) { 
        toast.error(error.response?.data?.error || "Failed to reject request");
      }
    },
    getRejection: async (request_id) => {
      try {
        const res = await axios.post(`/api/notification/get_rejection`, {
          requestId: request_id,
        });
        set({ rejectionReason: res.data.reject?.reason || null });
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to fetch Reason");
      }
    },
    getPending: async (request_id) => {
      try {
        // toast.error("hi")
        const res = await axios.post(`/api/notification/get_pending`, {
          requestId: request_id,
        });
        set({ pendingReason: res.data.request?.pending_reason || null });
      } catch (error) {
        toast.error(
          error.response?.data?.error || "Failed to fetch Pending Reason"
        );
      }
    },
    assetApprove_HR: async (userId) => {
      try {
        const { selectedRequest } = get();
        await axios.post(`/api/notification/asset_approve_hr`, {
          requestId: selectedRequest._id,
          requested_by: selectedRequest.requested_by,
        });
        await get().fetchNotifications(userId);
      } catch (error) {
        toast.error(
          error.response?.data?.error || "Failed to fetch notifications"
        );
      }
    },
    softwareApprove: async (userId) => {
      try {
        const { selectedRequest } = get();
        await axios.post(`/api/notification/software_approve`, {
          requestId: selectedRequest._id,
          requested_by: selectedRequest.requested_by,
        });
        await get().fetchNotifications(userId);
      } catch (error) {
        toast.error(
          error.response?.data?.error || "Failed to fetch notifications"
        );
      }
    },
    assetAllocate_IT: async (userId, assetId) => {
      try {
        const { selectedRequest } = get();
        await axios.post(`/api/notification/asset_allocate_it`, {
          requestId: selectedRequest._id,
          requested_by: selectedRequest.requested_by,
          asset_id: assetId,
          user_id: userId,
        });
        await get().fetchNotifications(userId);
      } catch (error) {
        toast.error(
          error.response?.data?.error || "Failed to fetch notifications"
        );
      }
    },
    softwareAllocate_IT: async (userId) => {
      try {
        const { selectedRequest } = get();
        await axios.post(`/api/notification/software_allocate_it`, {
          requestId: selectedRequest._id,
          requested_by: selectedRequest.requested_by,
          user_id: userId,
        });
        await get().fetchNotifications(userId);
      } catch (error) {
        toast.error(
          error.response?.data?.error || "Failed to fetch notifications"
        );
      }
    },
    underProcess_IT: async (userId) => {
      try {
        const { selectedRequest } = get();
        await axios.post(`/api/notification/underProcess_IT`, {
          requestId: selectedRequest._id,
          requested_by: selectedRequest.requested_by,
          user_id: userId,
        });
        await get().fetchNotifications(userId);
      } catch (error) {
        toast.error(
          error.response?.data?.error || "Failed to fetch notifications"
        );
      }
    },
    issueSolved_IT: async (userId, custom_Status = "Issue_Resolved") => {
      try {
        const { selectedRequest } = get();
        await axios.post(`/api/notification/issueSolved_IT`, {
          requestId: selectedRequest._id, 
          requested_by: selectedRequest.requested_by,
          user_id: userId,
          status : custom_Status,
        });  
        await get().fetchNotifications(userId);
      } catch (error) {
        toast.error(
          error.response?.data?.error || "Failed to fetch notifications"
        );
      }
    },
    underMaintenance_IT: async (userId) => {
      try {
        const { selectedRequest } = get();
        await axios.post(`/api/notification/underMaintenance_IT`, {
          requestId: selectedRequest._id,
          requested_by: selectedRequest.requested_by,
          user_id: userId,
        });
        await get().fetchNotifications(userId);
      } catch (error) {
        toast.error(
          error.response?.data?.error || "Failed to fetch notifications"
        );
      }
    },
    return_confirm: async (userId) => {
      try {
        const { selectedRequest } = get();
        await axios.post(`/api/notification/return_confirm`, {
          requestId: selectedRequest._id,                       
          requested_by: selectedRequest.requested_by,
          user_id: userId,                          
        });
        await get().fetchNotifications(userId);
      } catch (error) {
        toast.error(
          error.response?.data?.error || "Failed to fetch notifications"
        );
      }
    },
  };
});

export default useNotificationStore;
