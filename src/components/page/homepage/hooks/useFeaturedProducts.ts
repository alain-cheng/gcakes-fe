import { useEffect, useState } from "react";

import { ApiResponse } from "@/types/api-response";
import { Product } from "@/types/product";

/**
 * Use this as template for api integration
 */
export const useFeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<
    ApiResponse<Product[]>
  >({
    loading: true,
  });

  console.log("I am client side");

  useEffect(() => {
    /**
     * TODO: Product type has to be a variable
     */
    const t = fetch("/api/products/featured/cakes")
      .then(async (res) => {
        if (!res.ok) {
          throw await res.json();
        }

        return res.json().then((result) => {
          console.log(result);

          setFeaturedProducts({
            loading: false,
            value: result,
          });
        });
      })
      .catch((error) => {
        console.log("errored", error);

        setFeaturedProducts({
          loading: false,
          error,
        });
      });
  }, []);

  return featuredProducts;
};
