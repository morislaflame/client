import { makeAutoObservable, runInAction, action } from "mobx";
import {
  // Управление модельными продуктами
  fetchPendingModelProducts,
  approveModelProduct,
  rejectModelProduct,
  // Управление промокодами
  createSharedPromoCode,
  createOneTimePromoCode,
  getAllPromoCodes,
  deactivatePromoCode,
  deletePromoCode,
  // Управление пользователями
  fetchUsers,
  getUserById,
  changeUserRole,
  deleteUser,
  getUserByEmail,
  // Управление платформами для взрослых
  createAdultPlatform,
  deleteAdultPlatform,
  // Управление странами
  createCountry,
  deleteCountry,
  // Управление комиссионными ставками
  createCommissionRate,
  getAllCommissionRates,
  deleteCommissionRate,
  // Управление историями
  createStory,
  fetchStories,
  deleteStory,
} from "../http/adminAPI";

export default class AdminStore {
    // Состояния
    pendingModelProducts = [];
    promoCodes = [];
    users = [];
    adultPlatforms = [];
    countries = [];
    commissionRates = [];
    stories = [];
    
    // Загрузка состояний
    isLoadingPendingModels = false;
    isLoadingPromoCodes = false;
    isLoadingUsers = false;
    isLoadingCommissionRates = false;
    isLoadingStories = false;
  
    constructor() {
      makeAutoObservable(this, {
        // Управление моделями
        loadPendingModelProducts: action,
        approveModelProduct: action,
        rejectModelProduct: action,
        // Управление промокодами
        loadPromoCodes: action,
        createSharedPromoCode: action,
        createOneTimePromoCode: action,
        deactivatePromoCode: action,
        deletePromoCode: action,
        // Управление пользователями
        loadUsers: action,
        getUserById: action,
        changeUserRole: action,
        deleteUser: action,
        getUserByEmail: action,
        // Управление платформами
        createAdultPlatform: action,
        deleteAdultPlatform: action,
        // Управление странами
        createCountry: action,
        deleteCountry: action,
        // Управление комиссионными ставками
        loadCommissionRates: action,
        createCommissionRate: action,
        deleteCommissionRate: action,
        // Управление историями
        loadStories: action,
        createStory: action,
        deleteStory: action,
      });
    }
  
    // Управление модельными продуктами
    loadPendingModelProducts = async () => {
      this.isLoadingPendingModels = true;
      try {
        const data = await fetchPendingModelProducts();
        runInAction(() => {
          this.pendingModelProducts = data;
        });
      } catch (error) {
        console.error("Error fetching pending model products:", error);
      } finally {
        runInAction(() => {
          this.isLoadingPendingModels = false;
        });
      }
    };
  
    async approveModelProduct(modelProductId) {
      try {
        await approveModelProduct(modelProductId);
        runInAction(() => {
          this.pendingModelProducts = this.pendingModelProducts.filter(
            (product) => product.id !== modelProductId
          );
        });
      } catch (error) {
        console.error("Error approving model product:", error);
      }
    };
  
    async rejectModelProduct(modelProductId, rejectionReason) {
        try {
          await rejectModelProduct(modelProductId, rejectionReason);
          runInAction(() => {
            this.pendingModelProducts = this.pendingModelProducts.filter(
              (product) => product.id !== modelProductId
            );
          });
        } catch (error) {
          console.error("Error rejecting model product:", error);
        }
    };

  
    // Управление промокодами
    loadPromoCodes = async () => {
      this.isLoadingPromoCodes = true;
      try {
        const data = await getAllPromoCodes();
        runInAction(() => {
          this.promoCodes = data;
        });
      } catch (error) {
        console.error("Error fetching promo codes:", error);
      } finally {
        runInAction(() => {
          this.isLoadingPromoCodes = false;
        });
      }
    };
  
    createSharedPromoCode = async (promoCodeData) => {
      try {
        const data = await createSharedPromoCode(promoCodeData);
        runInAction(() => {
          this.promoCodes.push(data);
        });
      } catch (error) {
        console.error("Error creating shared promo code:", error);
      }
    };
  
    createOneTimePromoCode = async (promoCodeData) => {
      try {
        const data = await createOneTimePromoCode(promoCodeData);
        runInAction(() => {
          this.promoCodes.push(data);
        });
      } catch (error) {
        console.error("Error creating one-time promo code:", error);
      }
    };
  
    deactivatePromoCode = async (promoCodeId) => {
      try {
        await deactivatePromoCode(promoCodeId);
        runInAction(() => {
          const promoCode = this.promoCodes.find((code) => code.id === promoCodeId);
          if (promoCode) {
            promoCode.isActive = false;
          }
        });
      } catch (error) {
        console.error("Error deactivating promo code:", error);
      }
    };
  
    deletePromoCode = async (promoCodeId) => {
      try {
        await deletePromoCode(promoCodeId);
        runInAction(() => {
          this.promoCodes = this.promoCodes.filter((code) => code.id !== promoCodeId);
        });
      } catch (error) {
        console.error("Error deleting promo code:", error);
      }
    };
  
    // Управление пользователями
    loadUsers = async () => {
      this.isLoadingUsers = true;
      try {
        const data = await fetchUsers();
        runInAction(() => {
          this.users = data;
        });
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        runInAction(() => {
          this.isLoadingUsers = false;
        });
      }
    };
  
    getUserById = async (userId) => {
      try {
        const data = await getUserById(userId);
        return data;
      } catch (error) {
        console.error("Error fetching user by ID:", error);
      }
    };
  
    changeUserRole = async (userId, role) => {
      try {
        await changeUserRole(userId, role);
        runInAction(() => {
          const user = this.users.find((u) => u.id === userId);
          if (user) {
            user.role = role;
          }
        });
      } catch (error) {
        console.error("Error changing user role:", error);
      }
    };
  
    deleteUser = async (userId) => {
      try {
        await deleteUser(userId);
        runInAction(() => {
          this.users = this.users.filter((user) => user.id !== userId);
        });
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    };
  
    getUserByEmail = async (email) => {
      try {
        const data = await getUserByEmail(email);
        return data;
      } catch (error) {
        console.error("Error fetching user by email:", error);
      }
    };
  
    // Управление платформами для взрослых
    createAdultPlatform = async (adultPlatformData) => {
      try {
        const data = await createAdultPlatform(adultPlatformData);
        runInAction(() => {
          this.adultPlatforms.push(data);
        });
      } catch (error) {
        console.error("Error creating adult platform:", error);
      }
    };
  
    deleteAdultPlatform = async (adultPlatformId) => {
      try {
        await deleteAdultPlatform(adultPlatformId);
        runInAction(() => {
          this.adultPlatforms = this.adultPlatforms.filter(
            (platform) => platform.id !== adultPlatformId
          );
        });
      } catch (error) {
        console.error("Error deleting adult platform:", error);
      }
    };
  
    // Управление странами
    createCountry = async (countryData) => {
      try {
        const data = await createCountry(countryData);
        runInAction(() => {
          this.countries.push(data);
        });
      } catch (error) {
        console.error("Error creating country:", error);
      }
    };
  
    deleteCountry = async (countryId) => {
      try {
        await deleteCountry(countryId);
        runInAction(() => {
          this.countries = this.countries.filter((country) => country.id !== countryId);
        });
      } catch (error) {
        console.error("Error deleting country:", error);
      }
    };
  
    // Управление комиссионными ставками
    loadCommissionRates = async () => {
      this.isLoadingCommissionRates = true;
      try {
        const data = await getAllCommissionRates();
        runInAction(() => {
          this.commissionRates = data;
        });
      } catch (error) {
        console.error("Error fetching commission rates:", error);
      } finally {
        runInAction(() => {
          this.isLoadingCommissionRates = false;
        });
      }
    };
  
    createCommissionRate = async (commissionRateData) => {
      try {
        const data = await createCommissionRate(commissionRateData);
        runInAction(() => {
          this.commissionRates.push(data);
        });
      } catch (error) {
        console.error("Error creating commission rate:", error);
      }
    };
  
    deleteCommissionRate = async (commissionRateId) => {
      try {
        await deleteCommissionRate(commissionRateId);
        runInAction(() => {
          this.commissionRates = this.commissionRates.filter(
            (rate) => rate.id !== commissionRateId
          );
        });
      } catch (error) {
        console.error("Error deleting commission rate:", error);
      }
    };

    loadStories = async () => {
        this.isLoadingStories = true;
        try {
          const data = await fetchStories();
          runInAction(() => {
            this.stories = data;
          });
        } catch (error) {
          console.error("Error fetching stories:", error);
        } finally {
          runInAction(() => {
            this.isLoadingStories = false;
          });
        }
      };

    createStory = async (storyData) => {
        try {
          const data = await createStory(storyData);
          runInAction(() => {
            this.stories.push(data);
          });
        } catch (error) {
          console.error("Error creating story:", error);
          throw error; // Позволяет обработать ошибку в компоненте
        }
    };

    deleteStory = async (storyId) => {
        try {
          await deleteStory(storyId);
          runInAction(() => {
            this.stories = this.stories.filter((story) => story.id !== storyId);
          });
        } catch (error) {
          console.error("Error deleting story:", error);
          throw error; // Позволяет обработать ошибку в компоненте
        }
    };
      
      
      
  }
  
