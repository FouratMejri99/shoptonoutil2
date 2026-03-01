import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { productsService, supabase } from "@/lib/supabase";
import {
  Camera,
  Edit,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

interface PublishedTool {
  id: number;
  created_at: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
  subcategory: string;
  characteristics: string;
  deposit: number;
  description: string;
  user_id: string;
  city: string;
}

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tools, setTools] = useState<PublishedTool[]>([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingTool, setEditingTool] = useState<PublishedTool | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    characteristics: "",
    city: "",
    image_url: "",
  });
  const [savingTool, setSavingTool] = useState(false);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [profileData, setProfileData] = useState({
    name: "",
    city: "",
    address: "",
    latitude: "",
    longitude: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [idCardImage, setIdCardImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [idCardImagePreview, setIdCardImagePreview] = useState<string | null>(
    null
  );
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        setProfileData({
          name: user.user_metadata?.name || "",
          city: user.user_metadata?.city || "",
          address: user.user_metadata?.address || "",
          latitude: user.user_metadata?.latitude || "",
          longitude: user.user_metadata?.longitude || "",
        });
        await fetchUserTools(user.id);
      }
      setLoading(false);
    };
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserTools = async (userId: string) => {
    const { data, error } = await supabase
      .from("publish")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (data) {
      setTools(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: profileData.name,
          city: profileData.city,
          address: profileData.address,
        },
      });

      if (error) {
        toast.error("Erreur lors de la mise à jour du profil");
      } else {
        toast.success("Profil mis à jour avec succès");
        setEditingProfile(false);
        setUser({
          ...user,
          user_metadata: { ...user.user_metadata, ...profileData },
        });
      }
    } catch (err) {
      toast.error("Erreur lors de la mise à jour du profil");
    }
  };

  // Handle profile image selection
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle ID card image selection (including camera capture)
  const handleIdCardImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdCardImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdCardImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Supabase storage
  const uploadImage = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from("products")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(error.message);
    }

    const { data: urlData } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  // Save profile with images
  const handleSaveProfileWithImages = async () => {
    if (!user) return;

    setSavingProfile(true);
    try {
      const metadata: any = {
        name: profileData.name,
        city: profileData.city,
        address: profileData.address,
        latitude: profileData.latitude
          ? parseFloat(profileData.latitude)
          : null,
        longitude: profileData.longitude
          ? parseFloat(profileData.longitude)
          : null,
      };

      // Upload profile image if selected
      if (profileImage) {
        try {
          const imageUrl = await uploadImage(profileImage, "profiles");
          metadata.avatar_url = imageUrl;
        } catch (uploadError) {
          console.error("Profile image upload error:", uploadError);
          toast.error("Erreur lors de l'upload de la photo de profil");
          setSavingProfile(false);
          return;
        }
      }

      // Upload ID card image if selected
      if (idCardImage) {
        try {
          const idCardUrl = await uploadImage(idCardImage, "id_cards");
          metadata.id_card_url = idCardUrl;
        } catch (uploadError) {
          console.error("ID card upload error:", uploadError);
          toast.error("Erreur lors de l'upload de la pièce d'identité");
          setSavingProfile(false);
          return;
        }
      }

      const { error } = await supabase.auth.updateUser({
        data: metadata,
      });

      if (error) {
        toast.error("Erreur lors de la mise à jour du profil");
      } else {
        toast.success("Profil mis à jour avec succès");
        setEditingProfile(false);
        setProfileImage(null);
        setIdCardImage(null);
        setProfileImagePreview(null);
        setIdCardImagePreview(null);
        setUser({
          ...user,
          user_metadata: { ...user.user_metadata, ...metadata },
        });
      }
    } catch (err) {
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDeleteTool = async (toolId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet outil ?")) return;

    const { error } = await supabase.from("publish").delete().eq("id", toolId);

    if (error) {
      toast.error("Erreur lors de la suppression");
    } else {
      toast.success("Outil supprimé");
      setTools(tools.filter(t => t.id !== toolId));
    }
  };

  const handleEditClick = (tool: PublishedTool) => {
    setEditingTool(tool);
    setEditFormData({
      name: tool.name || "",
      description: tool.description || "",
      price: tool.price?.toString() || "",
      category: tool.category || "",
      subcategory: tool.subcategory || "",
      characteristics: tool.characteristics || "",
      city: tool.city || "",
      image_url: tool.image_url || "",
    });
    setEditImageFile(null);
  };

  const handleSaveEdit = async () => {
    if (!editingTool) return;
    setSavingTool(true);

    let imageUrl = editFormData.image_url;

    // Upload new image if selected
    if (editImageFile) {
      try {
        // Delete old image if exists
        if (editFormData.image_url) {
          try {
            await productsService.deleteProductImage(editFormData.image_url);
          } catch (e) {
            console.log("Could not delete old image:", e);
          }
        }
        imageUrl = await productsService.uploadProductImage(editImageFile);
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        toast.error("Erreur lors de l'upload de l'image");
      }
    }

    const { error } = await supabase
      .from("publish")
      .update({
        name: editFormData.name,
        description: editFormData.description,
        price: parseFloat(editFormData.price) || 0,
        category: editFormData.category,
        subcategory: editFormData.subcategory,
        characteristics: editFormData.characteristics,
        city: editFormData.city,
        image_url: imageUrl,
      })
      .eq("id", editingTool.id);

    if (error) {
      toast.error("Erreur lors de la mise à jour");
    } else {
      toast.success("Outil mis à jour avec succès");
      setTools(
        tools.map(t =>
          t.id === editingTool.id
            ? {
                ...t,
                ...editFormData,
                price: parseFloat(editFormData.price) || 0,
                image_url: imageUrl,
              }
            : t
        )
      );
      setEditingTool(null);
    }
    setSavingTool(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Connexion requise
            </h2>
            <p className="text-gray-600 mb-6">
              Vous devez être connecté pour voir votre profil.
            </p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header - Profile Info */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              {editingProfile ? (
                <div className="space-y-3">
                  {/* Profile Image Upload */}
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Photo de profil</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="hidden"
                      />
                    </label>
                    {profileImage && (
                      <span className="text-sm text-green-600">
                        ✓ Image sélectionnée
                      </span>
                    )}
                  </div>

                  {/* ID Card Image Capture */}
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Camera className="w-4 h-4" />
                      <span className="text-sm">Prendre photo CIN</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleIdCardImageChange}
                        className="hidden"
                      />
                    </label>
                    {idCardImage && (
                      <span className="text-sm text-green-600">
                        ✓ CIN sélectionné
                      </span>
                    )}
                  </div>

                  {/* ID Card Preview */}
                  {idCardImagePreview && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Aperçu CIN:</p>
                      <img
                        src={idCardImagePreview}
                        alt="ID Card"
                        className="w-32 h-20 object-cover rounded-lg border"
                      />
                    </div>
                  )}

                  <input
                    type="text"
                    value={profileData.name}
                    onChange={e =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    placeholder="Votre nom"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={profileData.city}
                    onChange={e =>
                      setProfileData({ ...profileData, city: e.target.value })
                    }
                    placeholder="Votre ville"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={e =>
                      setProfileData({
                        ...profileData,
                        address: e.target.value,
                      })
                    }
                    placeholder="Votre adresse"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={profileData.latitude}
                      onChange={e =>
                        setProfileData({
                          ...profileData,
                          latitude: e.target.value,
                        })
                      }
                      placeholder="Latitude"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={profileData.longitude}
                      onChange={e =>
                        setProfileData({
                          ...profileData,
                          longitude: e.target.value,
                        })
                      }
                      placeholder="Longitude"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          position => {
                            setProfileData({
                              ...profileData,
                              latitude: position.coords.latitude.toString(),
                              longitude: position.coords.longitude.toString(),
                            });
                            toast.success("Position récupérée avec succès!");
                          },
                          error => {
                            toast.error(
                              "Impossible de récupérer la position: " +
                                error.message
                            );
                          }
                        );
                      } else {
                        toast.error(
                          "La géolocalisation n'est pas supportée par ce navigateur"
                        );
                      }
                    }}
                    className="w-full"
                  >
                    📍 Obtenir ma position actuelle
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveProfileWithImages}
                      disabled={savingProfile}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {savingProfile ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingProfile(false);
                        setProfileImage(null);
                        setIdCardImage(null);
                        setProfileImagePreview(null);
                        setIdCardImagePreview(null);
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.user_metadata?.name || "Utilisateur"}
                  </h1>
                  <p className="text-gray-500">{user.email}</p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingProfile(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier le profil
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        {!editingProfile && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Informations du profil
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Nom</p>
                  <p className="font-medium text-gray-900">
                    {user.user_metadata?.name || "Non défini"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Ville</p>
                  <p className="font-medium text-gray-900">
                    {user.user_metadata?.city || "Non défini"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Type de profil</p>
                  <p className="font-medium text-gray-900">
                    {user.user_metadata?.profile_type === "bricoleur"
                      ? "Bricoleur"
                      : "Loueur professionnel"}
                  </p>
                </div>
              </div>
              {/* ID Card Status */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <Camera className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    Pièce d'identité (CIN)
                  </p>
                  {user.user_metadata?.id_card_url ? (
                    <div className="flex items-center gap-2 mt-1">
                      <p className="font-medium text-green-600">Vérifiée</p>
                      <img
                        src={user.user_metadata.id_card_url}
                        alt="CIN"
                        className="w-16 h-10 object-cover rounded ml-2"
                      />
                    </div>
                  ) : (
                    <p className="font-medium text-orange-600">Non vérifiée</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Published Tools */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Mes outils publiés
            </h2>
            <Link href="/publier-outil">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </Link>
          </div>

          {tools.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                Vous n'avez pas encore publié d'outils.
              </p>
              <Link href="/publier-outil">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Publier mon premier outil
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {tools.map(tool => (
                <Card key={tool.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                        {tool.image_url ? (
                          <img
                            src={tool.image_url}
                            alt={tool.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Plus className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {tool.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {tool.category}
                            </p>
                            {tool.subcategory && (
                              <p className="text-xs text-gray-400">
                                {tool.subcategory}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-600">
                              {tool.price}€/jour
                            </p>
                            {tool.deposit > 0 && (
                              <p className="text-xs text-gray-500">
                                Caution: {tool.deposit}€
                              </p>
                            )}
                          </div>
                        </div>
                        {tool.city && (
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-2">
                            <MapPin className="w-3 h-3" />
                            {tool.city}
                          </p>
                        )}
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(tool)}
                          >
                            <Pencil className="w-3 h-3 mr-1" />
                            Modifier
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteTool(tool.id)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Tool Modal */}
      {editingTool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Modifier l'outil
              </h2>

              <div className="space-y-4">
                {/* Image upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo de l'outil
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {editImageFile ? (
                        <img
                          src={URL.createObjectURL(editImageFile)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : editFormData.image_url ? (
                        <img
                          src={editFormData.image_url}
                          alt={editFormData.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Upload size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            setEditImageFile(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                        id="edit-image-upload"
                      />
                      <label
                        htmlFor="edit-image-upload"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Changer la photo
                      </label>
                      {editImageFile && (
                        <button
                          type="button"
                          onClick={() => setEditImageFile(null)}
                          className="ml-2 text-sm text-red-600 hover:text-red-800"
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l'outil
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={e =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editFormData.description}
                    onChange={e =>
                      setEditFormData({
                        ...editFormData,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix (€ / jour)
                    </label>
                    <input
                      type="number"
                      value={editFormData.price}
                      onChange={e =>
                        setEditFormData({
                          ...editFormData,
                          price: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ville
                    </label>
                    <input
                      type="text"
                      value={editFormData.city}
                      onChange={e =>
                        setEditFormData({
                          ...editFormData,
                          city: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={editFormData.category}
                    onChange={e =>
                      setEditFormData({
                        ...editFormData,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="Outils électroportatifs">
                      Outils électroportatifs
                    </option>
                    <option value="Chantier & gros œuvre">
                      Chantier &amp; gros œuvre
                    </option>
                    <option value="Plomberie">Plomberie</option>
                    <option value="Menuiserie & travail du bois">
                      Menuiserie &amp; travail du bois
                    </option>
                    <option value="Peinture & revêtements">
                      Peinture &amp; revêtements
                    </option>
                    <option value="Jardinage">Jardinage</option>
                    <option value="Sécurité & EPI">Sécurité &amp; EPI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sous-catégorie / Outil spécifique
                  </label>
                  <input
                    type="text"
                    value={editFormData.subcategory}
                    onChange={e =>
                      setEditFormData({
                        ...editFormData,
                        subcategory: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Caractéristiques
                  </label>
                  <input
                    type="text"
                    value={editFormData.characteristics}
                    onChange={e =>
                      setEditFormData({
                        ...editFormData,
                        characteristics: e.target.value,
                      })
                    }
                    placeholder="Séparez par des virgules"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleSaveEdit}
                  disabled={savingTool}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {savingTool ? "Enregistrement..." : "Enregistrer"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingTool(null)}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
