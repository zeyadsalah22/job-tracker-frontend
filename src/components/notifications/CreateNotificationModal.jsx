// import { useState } from "react";
// import { X } from "lucide-react";
// import Button from "../ui/Button";
// import Input from "../ui/Input";
// import { Textarea } from "../ui/Textarea";
// import { Select } from "../ui/Select";
// import FormField from "../ui/FormField";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";
// import { useFormik } from "formik";
// import { notificationCreateSchema } from "../../schemas/Schemas";
// import { NOTIFICATION_TYPES } from "../../store/notification.store";
// import useNotificationStore from "../../store/notification.store";
// import { toast } from "react-toastify";

// const CreateNotificationModal = ({ 
//   isOpen, 
//   onClose, 
//   initialData = {},
//   onSuccess 
// }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { createNotification } = useNotificationStore();

//   const formik = useFormik({
//     initialValues: {
//       userId: initialData.userId || "",
//       actorId: initialData.actorId || "",
//       type: initialData.type || "",
//       entityTargetedId: initialData.entityTargetedId || "",
//       message: initialData.message || "",
//     },
//     validationSchema: notificationCreateSchema,
//     onSubmit: async (values) => {
//       setIsSubmitting(true);
//       try {
//         // Convert string numbers to integers
//         const submitData = {
//           ...values,
//           userId: values.userId ? parseInt(values.userId, 10) : undefined,
//           actorId: values.actorId ? parseInt(values.actorId, 10) : undefined,
//           entityTargetedId: values.entityTargetedId ? parseInt(values.entityTargetedId, 10) : null,
//         };

//         // Remove empty optional fields
//         Object.keys(submitData).forEach(key => {
//           if (submitData[key] === "" || submitData[key] === undefined) {
//             delete submitData[key];
//           }
//         });

//         const newNotification = await createNotification(submitData);
        
//         toast.success("Notification created successfully");
        
//         if (onSuccess) {
//           onSuccess(newNotification);
//         }
        
//         handleClose();
//       } catch (error) {
//         toast.error(error.message || "Failed to create notification");
//         console.error("Failed to create notification:", error);
//       } finally {
//         setIsSubmitting(false);
//       }
//     },
//   });

//   const handleClose = () => {
//     formik.resetForm();
//     onClose();
//   };

//   const notificationTypeOptions = Object.entries(NOTIFICATION_TYPES).map(([key, value]) => ({
//     value: value,
//     label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
//   }));

//   return (
//     <Dialog open={isOpen} onOpenChange={handleClose}>
//       <DialogContent className="sm:max-w-[600px]">
//         <DialogHeader>
//           <div className="flex items-center justify-between">
//             <DialogTitle>Create Notification</DialogTitle>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={handleClose}
//               className="h-8 w-8 p-0"
//             >
//               <X className="h-4 w-4" />
//             </Button>
//           </div>
//         </DialogHeader>

//         <form onSubmit={formik.handleSubmit} className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* User ID */}
//             <FormField
//               label="User ID (Optional)"
//               error={formik.touched.userId && formik.errors.userId}
//             >
//               <Input
//                 type="number"
//                 placeholder="Enter user ID"
//                 {...formik.getFieldProps("userId")}
//               />
//             </FormField>

//             {/* Actor ID */}
//             <FormField
//               label="Actor ID (Optional)"
//               error={formik.touched.actorId && formik.errors.actorId}
//             >
//               <Input
//                 type="number"
//                 placeholder="Enter actor ID"
//                 {...formik.getFieldProps("actorId")}
//               />
//             </FormField>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Notification Type */}
//             <FormField
//               label="Type (Optional)"
//               error={formik.touched.type && formik.errors.type}
//             >
//               <Select
//                 placeholder="Select notification type"
//                 value={formik.values.type}
//                 onValueChange={(value) => formik.setFieldValue("type", value)}
//               >
//                 {notificationTypeOptions.map((option) => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </Select>
//             </FormField>

//             {/* Entity Targeted ID */}
//             <FormField
//               label="Entity Targeted ID (Optional)"
//               error={formik.touched.entityTargetedId && formik.errors.entityTargetedId}
//             >
//               <Input
//                 type="number"
//                 placeholder="Enter entity ID"
//                 {...formik.getFieldProps("entityTargetedId")}
//               />
//             </FormField>
//           </div>

//           {/* Message */}
//           <FormField
//             label="Message *"
//             error={formik.touched.message && formik.errors.message}
//           >
//             <Textarea
//               placeholder="Enter notification message..."
//               rows={4}
//               {...formik.getFieldProps("message")}
//             />
//           </FormField>

//           {/* Actions */}
//           <div className="flex justify-end gap-2 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={handleClose}
//               disabled={isSubmitting}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={isSubmitting || !formik.isValid}
//             >
//               {isSubmitting ? "Creating..." : "Create Notification"}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CreateNotificationModal;