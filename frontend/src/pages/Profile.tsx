import { useState, useEffect, type FormEvent, type FC } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import {
    Card,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Mail,
    MapPin,
    Edit,
    Loader2,
    AlertTriangle,
    Trash2,
    Phone,
    Banknote,
    User,
    ClipboardList,
    Check,
    X,
    LayoutDashboard,
    Shield,
    GraduationCap,
    BarChart3
} from "lucide-react";
import { Link } from "react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMediaStore } from "@/store/useMediaStore";
import MediaUpload from "@/components/MediaUpload.tsx";

const AVAILABLE_ROLES = ["USER", "EXPERT", "SELLER", "CREATOR"];

interface FullProfileEditFormProps {
    user: any;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: object) => Promise<void | boolean>;
    isUpdating: boolean;
}

export const FullProfileEditForm: FC<FullProfileEditFormProps> = ({ user, isOpen, onClose, onSave, isUpdating }) => {
    const { mediaList, resetMedia } = useMediaStore();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        bio: "",
        phoneNumber: "",
        roles: [] as string[],
        profilePic: {
            mediaId: null as string | null,
            url: "",
        },
        // Address
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
        // Bank
        accountHolderName: "",
        accountNumber: "",
        ifscCode: "",
        bankName: "",
        fieldOfExpertise: "",
        institution: "",
    });

    useEffect(() => {
        if (isOpen && user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                bio: user.bio || "",
                phoneNumber: user.phoneNumber || "",
                roles: user.roles || ["USER"],
                profilePic: {
                    mediaId: user.profilePic?.mediaId || null,
                    url: user.profilePic?.url || "",
                },
                street: user.address?.street || "",
                city: user.address?.city || "",
                state: user.address?.state || "",
                pincode: user.address?.pincode || "",
                country: user.address?.country || "",
                accountHolderName: user.bankDetails?.accountHolderName || "",
                accountNumber: user.bankDetails?.accountNumber || "",
                ifscCode: user.bankDetails?.ifscCode || "",
                bankName: user.bankDetails?.bankName || "",
                fieldOfExpertise: user.expertDetails?.fieldOfExpertise || "",
                institution: user.expertDetails?.institution || "",
            });
        }
        console.log(user)
    }, [isOpen, user]);

    useEffect(() => {
        if (mediaList.length > 0) {
            const latestMedia = mediaList[0];
            setFormData((prev) => ({
                ...prev,
                profilePic: {
                    mediaId: latestMedia._id,
                    url: latestMedia.url,
                },
            }));
        }
    }, [mediaList]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRoleChange = (roleName: string, checked: boolean | 'indeterminate') => {
        setFormData(prev => {
            let newRoles = [...prev.roles];
            if (checked === true) {
                if (!newRoles.includes(roleName)) newRoles.push(roleName);
            } else {
                newRoles = newRoles.filter(role => role !== roleName);
            }
            return { ...prev, roles: newRoles };
        });
    };

    const clearImage = () => {
        setFormData(prev => ({ ...prev, profilePic: { mediaId: null, url: "" } }));
        resetMedia();
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const updateData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            bio: formData.bio,
            phoneNumber: formData.phoneNumber,
            roles: formData.roles,
            profilePic: formData.profilePic,
            address: {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                country: formData.country,
            },
            bankDetails: {
                accountHolderName: formData.accountHolderName,
                accountNumber: formData.accountNumber,
                ifscCode: formData.ifscCode,
                bankName: formData.bankName,
            },
            expertDetails: {
                fieldOfExpertise: formData.fieldOfExpertise,
                institution: formData.institution,
                verified: true
            }
        };

        const success = await onSave(updateData);
        if (success) onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <User className="w-5 h-5 text-green-600" /> Edit Full Profile
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-8 py-4">

                    <div className="flex flex-col items-center justify-center space-y-3 bg-muted/30 p-4 rounded-lg border-2 border-dashed">
                        <Label className="text-sm font-semibold">Profile Picture</Label>
                        {!formData.profilePic.url ? (
                            <div className="w-full"><MediaUpload module="profile" type="image" /></div>
                        ) : (
                            <div className="relative h-32 w-32 group">
                                <img src={formData.profilePic.url} alt="Profile" className="h-full w-full object-cover rounded-full border-4 border-white shadow-md" />
                                <button type="button" onClick={clearImage} className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 shadow-lg hover:scale-110 transition-transform"><X size={16} /></button>
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">Upload a professional photo for your profile.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label htmlFor="firstName">First Name</Label><Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} /></div>
                            <div className="space-y-2"><Label htmlFor="lastName">Last Name</Label><Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label htmlFor="email">Email Address</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} /></div>
                            <div className="space-y-2"><Label htmlFor="phoneNumber">Phone Number</Label><Input id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} /></div>
                        </div>
                        <div className="space-y-2"><Label htmlFor="bio">Professional Bio</Label><Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={3} /></div>
                    </div>

                    <div className="space-y-4 border-t pt-4">
                        <h4 className="font-medium flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4" /> Location Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 space-y-2"><Label htmlFor="street">Street Address</Label><Input id="street" name="street" value={formData.street} onChange={handleChange} /></div>
                            <div className="space-y-2"><Label htmlFor="city">City</Label><Input id="city" name="city" value={formData.city} onChange={handleChange} /></div>
                            <div className="space-y-2"><Label htmlFor="state">State</Label><Input id="state" name="state" value={formData.state} onChange={handleChange} /></div>
                            <div className="space-y-2"><Label htmlFor="country">Country</Label><Input id="country" name="country" value={formData.country} onChange={handleChange} /></div>
                            <div className="space-y-2"><Label htmlFor="pincode">Pincode</Label><Input id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} /></div>
                        </div>
                    </div>

                    <div className="space-y-4 border-t pt-4">
                        <h4 className="font-medium flex items-center gap-2 text-muted-foreground"><Shield className="w-4 h-4" /> Permissions & Roles</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {AVAILABLE_ROLES.map(role => (
                                <div key={role} className="flex items-center space-x-2 bg-muted/20 p-2 rounded-md border">
                                    <Checkbox id={`role-${role}`} checked={formData.roles.includes(role)} onCheckedChange={(c) => handleRoleChange(role, c)} disabled={isUpdating} />
                                    <Label htmlFor={`role-${role}`} className="text-xs font-bold cursor-pointer">{role}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {formData.roles.includes("EXPERT") && (
                        <div className="space-y-4 border-t pt-4">
                            <h4 className="font-medium flex items-center gap-2 text-muted-foreground">
                                <GraduationCap className="w-4 h-4" /> Professional Expertise
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fieldOfExpertise">Area of Specialization</Label>
                                    <Input id="fieldOfExpertise" name="fieldOfExpertise" value={formData.fieldOfExpertise} onChange={handleChange} placeholder="e.g. Traditional Pottery" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="institution">Affiliated Institution</Label>
                                    <Input id="institution" name="institution" value={formData.institution} onChange={handleChange} placeholder="e.g. Heritage Council" />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="space-y-4 border-t pt-4">
                        <h4 className="font-medium flex items-center gap-2 text-muted-foreground"><Banknote className="w-4 h-4" /> Payout Settings</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label htmlFor="accountHolderName">Account Holder</Label><Input id="accountHolderName" name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} /></div>
                            <div className="space-y-2"><Label htmlFor="bankName">Bank Name</Label><Input id="bankName" name="bankName" value={formData.bankName} onChange={handleChange} /></div>
                            <div className="space-y-2"><Label htmlFor="accountNumber">Account Number</Label><Input id="accountNumber" name="accountNumber" value={formData.accountNumber} onChange={handleChange} /></div>
                            <div className="space-y-2"><Label htmlFor="ifscCode">IFSC Code</Label><Input id="ifscCode" name="ifscCode" value={formData.ifscCode} onChange={handleChange} /></div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={isUpdating}>Cancel</Button>
                        <Button type="submit" className="flex-[2] bg-green-600 hover:bg-green-700 text-white" disabled={isUpdating}>
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />} Update Profile
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default function ProfilePage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { userProfile, isFetchingProfile, fetchUserProfile, isDeletingUser, deleteUserAccount, isUpdatingProfile, updateUserProfile } = useUserStore();
    const { logout } = useAuthStore();

    useEffect(() => { if (!userProfile) fetchUserProfile(); }, [userProfile, fetchUserProfile]);

    const handleFullFormUpdate = async (updateData: object) => {
        if (!userProfile) return false;
        return await updateUserProfile(updateData);
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure? This action is irreversible.")) {
            await deleteUserAccount();
            logout();
            toast.success("Account deleted.");
        }
    };

    if (isFetchingProfile) return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-green-600 mr-2" /><p className="text-lg">Loading profile data...</p></div>;
    if (!userProfile) return <div className="container mx-auto px-4 py-10 max-w-5xl text-center"><Card className="shadow-sm p-8"><AlertTriangle className="h-10 w-10 mx-auto mb-4 text-red-500" /><CardTitle>Profile Not Found</CardTitle><Button onClick={fetchUserProfile} className="mt-4">Retry Loading</Button></Card></div>;

    const user = userProfile;
    const fullName = `${user.firstName} ${user.lastName}`;

    return (
        <>
            <div className="container mx-auto px-4 py-10 max-w-5xl space-y-6">
                <Card className="shadow-lg relative p-6">
                    <div className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-start">
                        <Avatar className="w-24 h-24 border-4 border-green-500 shadow-md flex-shrink-0">
                            <AvatarImage src={user?.profilePic?.url || "/placeholder-user.jpg"} />
                            <AvatarFallback className="text-3xl font-bold bg-green-100 text-green-600">{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="mt-4 text-center sm:text-left sm:mt-0 sm:ml-6">
                            <CardTitle className="text-3xl font-extrabold">{fullName}</CardTitle>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                                {user.roles?.map((role: string) => (<Badge key={role} className="text-sm bg-green-500 hover:bg-green-600 text-white">{role}</Badge>))}
                            </div>
                            <p className="text-sm text-muted-foreground mt-3 italic max-w-prose">{user.bio || "No bio provided."}</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="absolute top-4 right-4 text-green-600 border-green-300 hover:bg-green-50" onClick={() => setIsFormOpen(true)}><Edit className="h-4 w-4 mr-2" /> Edit Profile</Button>
                </Card>

                {/* MULTI-DASHBOARD SECTION */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {user.roles?.includes("ADMIN") && (
                        <Link to="/admin/dashboard" className="w-full">
                            <Button variant="default" className="bg-slate-800 hover:bg-slate-900 text-white w-full"><Shield className="h-4 w-4 mr-2" /> Admin Panel</Button>
                        </Link>
                    )}
                    {user.roles?.includes("SELLER") && (
                        <Link to="/heritagebazzar/dashboard" className="w-full">
                            <Button variant="default" className="bg-green-600 hover:bg-green-700 text-white w-full"><LayoutDashboard className="h-4 w-4 mr-2" /> Seller Dashboard</Button>
                        </Link>
                    )}
                    {user.roles?.includes("EXPERT") && (
                        <Link to="/sangam/dashboard" className="w-full">
                            <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white w-full"><GraduationCap className="h-4 w-4 mr-2" /> Expert Dashboard</Button>
                        </Link>
                    )}
                    {user.roles?.includes("CREATOR") && (
                        <Link to="/dharohartv/dashboard" className="w-full">
                            <Button variant="default" className="bg-purple-600 hover:bg-purple-700 text-white w-full"><BarChart3 className="h-4 w-4 mr-2" /> Creator Dashbbard</Button>
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="shadow-sm p-6 space-y-4">
                        <h3 className="text-xl font-semibold flex items-center border-b pb-2 mb-2"><Phone className="h-5 w-5 mr-2 text-green-600" /> Contact Info</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center"><Mail className="h-4 w-4 mr-3 text-muted-foreground flex-shrink-0" /><span className="font-semibold w-20">Email:</span><span className="truncate">{user.email}</span></div>
                            <div className="flex items-center"><Phone className="h-4 w-4 mr-3 text-muted-foreground flex-shrink-0" /><span className="font-semibold w-20">Phone:</span><span>{user.phoneNumber || "N/A"}</span></div>
                        </div>
                    </Card>

                    {/* DYNAMIC EXPERT DETAILS DISPLAY */}
                    {user.roles?.includes("EXPERT") && (
                        <Card className="shadow-sm p-6 space-y-4">
                            <h3 className="text-xl font-semibold flex items-center border-b pb-2 mb-2">
                                <Shield className="h-5 w-5 mr-2 text-green-600" /> Professional Verification
                            </h3>
                            <div className="space-y-1 text-sm">
                                <p><span className="font-semibold">Specialization:</span> {user.expertDetails?.fieldOfExpertise || 'N/A'}</p>
                                <p><span className="font-semibold">Institution:</span> {user.expertDetails?.institution || 'N/A'}</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="font-semibold">Status:</span>
                                    {user.expertDetails?.verified ? (
                                        <Badge className="bg-blue-100 text-green-600">Verified Expert</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-amber-600 border-amber-300">Verification Pending</Badge>
                                    )}
                                </div>
                            </div>
                        </Card>
                    )}

                    <Card className="shadow-sm p-6 space-y-4">
                        <h3 className="text-xl font-semibold flex items-center border-b pb-2 mb-2"><ClipboardList className="h-5 w-5 mr-2 text-green-600" /> Status</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between"><span className="font-semibold">Account Status:</span><Badge className="bg-green-100 text-green-800" variant="outline">Approved</Badge></div>
                            <div className="flex items-center justify-between"><span className="font-semibold">Onboarding:</span><Badge  className="bg-green-100 text-green-800">{user.iSOnboarded ? "Complete" : "Pending"}</Badge></div>
                        </div>
                    </Card>

                    {user.address && (
                        <Card className="shadow-sm p-6 space-y-4"><h3 className="text-xl font-semibold flex items-center border-b pb-2 mb-2"><MapPin className="h-5 w-5 mr-2 text-green-600" /> Address</h3><div className="space-y-1 text-sm"><p><span className="font-semibold">Street:</span> {user.address.street || 'N/A'}</p><p><span className="font-semibold">City:</span> {user.address.city || 'N/A'}</p><p><span className="font-semibold">State:</span> {user.address.state || 'N/A'}</p><p><span className="font-semibold">Country:</span> {user.address.country || 'N/A'}</p></div></Card>
                    )}

                    {user.bankDetails && (
                        <Card className="shadow-sm p-6 space-y-4"><h3 className="text-xl font-semibold flex items-center border-b pb-2 mb-2"><Banknote className="h-5 w-5 mr-2 text-green-600" /> Bank Details</h3><div className="space-y-1 text-sm"><p><span className="font-semibold">Account holder:</span> {user.bankDetails.accountHolderName || 'N/A'}</p><p><span className="font-semibold">Bank:</span> {user.bankDetails.bankName || 'N/A'}</p><p><span className="font-semibold">Account No:</span> {user.bankDetails.accountNumber ? `****${user.bankDetails.accountNumber.slice(-4)}` : 'N/A'}</p><p><span className="font-semibold">IFSC:</span> {user.bankDetails.ifscCode || 'N/A'}</p></div></Card>
                    )}
                </div>

                <div className="mt-6 flex justify-between items-center bg-red-50 p-4 rounded-lg dark:bg-red-950/40">
                    <div><p className="font-medium text-base text-red-600 flex items-center"><AlertTriangle className="h-5 w-5 mr-2" /> Danger Zone</p><p className="text-sm text-gray-700 dark:text-red-200">Permanently delete your account.</p></div>
                    <Button className="bg-red-600 hover:bg-red-700 text-white" size="sm" onClick={handleDeleteAccount} disabled={isDeletingUser}>{isDeletingUser ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />} Delete</Button>
                </div>
            </div>

            {userProfile && <FullProfileEditForm user={userProfile} isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSave={handleFullFormUpdate} isUpdating={isUpdatingProfile} />}
        </>
    );
}