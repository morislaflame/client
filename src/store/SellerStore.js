import { makeAutoObservable, runInAction, action } from "mobx";
import { 
    createModelProduct, 
    updateModelProduct, 
    deleteModelProduct, 
    fetchMyModelProducts, 
    fetchMyOrders, 
    createSellerReview, 
    getSellerReviews,
    updateMyInformation,
    fetchMyInformation
} from "../http/sellerAPI";

export default class SellerStore {
    myModelProducts = [];
    myOrders = [];
    sellerReviews = [];
    sellerInfo = {};
    sellerReviewsLoading = false;

    constructor() {
        makeAutoObservable(this, {
            loadMyModelProducts: action,
            loadMyOrders: action,
            createModelProduct: action,
            updateModelProduct: action,
            deleteModelProduct: action,
            createSellerReview: action,
            getSellerReviews: action,
            updateMyInfo: action,
            fetchMyInformation: action,
        });
    }

    loadMyModelProducts = async () => {
        try {
            const data = await fetchMyModelProducts();
            runInAction(() => {
              this.myModelProducts = data;
            });
        } catch (error) {
            console.error("Error loading products:", error);
        }
    }

    loadMyOrders = async () => {
        try {
            const data = await fetchMyOrders();
            runInAction(() => {
                this.myOrders = data;
            });
        } catch (error) {
            console.error("Error loading orders:", error);
        }
    }

    createModelProduct = async (formData) => {
        try {
            const newModelProduct = await createModelProduct(formData);
            runInAction(() => {
                this.myModelProducts.push(newModelProduct);
            });
        } catch (error) {
            console.error("Error creating product:", error);
        }
    }

    updateProduct = async (modelProductId, formData) => {
        try {
          const updatedProduct = await updateModelProduct(modelProductId, formData);
          runInAction(() => {
            const index = this.myModelProducts.findIndex(
              (product) => product.id === modelProductId
            );
            if (index !== -1) {
              this.myModelProducts[index] = updatedProduct;
            }
          });
        } catch (error) {
          console.error("Error updating product:", error);
        }
    }

    deleteProduct = async (modelProductId) => {
        try {
          await deleteModelProduct(modelProductId);
          runInAction(() => {
            this.myModelProducts = this.myModelProducts.filter(
              (product) => product.id !== modelProductId
            );
          });
        } catch (error) {
          console.error("Error deleting product:", error);
        }
    }

    loadMyInformation = async () => {
        try {
            const data = await fetchMyInformation();
            runInAction(() => {
                this.sellerInfo = data;
            });
        } catch (error) {
            console.error("Error fetching seller information:", error);
        }
    }   

    updateSellerInfo = async (formData) => {
        try {
          const updatedInfo = await updateMyInformation(formData);
          runInAction(() => {
            this.sellerInfo = updatedInfo;
          });
        } catch (error) {
          console.error("Error updating seller information:", error);
        }
    }

    addSellerReview = async (sellerId, formData) => {
        try {
          const response = await createSellerReview(sellerId, formData);
          runInAction(() => {
            this.sellerReviews.push(response.review);
          });
        } catch (error) {
          console.error("Error creating seller review:", error);
          throw error; // Позволяет обработать ошибку в компоненте
        }
    }

    loadSellerReviews = async (sellerId) => {
        this.sellerReviewsLoading = true;
        try {
          const data = await getSellerReviews(sellerId);
          runInAction(() => {
            this.sellerReviews = data;
            this.sellerReviewsLoading = false;
          });
        } catch (error) {
          console.error("Error loading seller reviews:", error);
          runInAction(() => {
            this.sellerReviewsLoading = false;
          });
        }
    }
}
