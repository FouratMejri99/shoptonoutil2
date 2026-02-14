// Mock tRPC client for frontend-only Supabase architecture
// This provides a compatible API for existing components

import { useCallback, useEffect, useState } from "react";

import {
  adminService,
  authService,
  blogService,
  caseStudiesService,
  employeeService,
  leadsService,
  servicesService,
  testimonialsService,
} from "./supabase";

// Helper to create a query hook with useQuery pattern
function createQueryHook<T, P>(queryFn: (params: P) => Promise<T>) {
  const useQuery = (_options?: { retry?: boolean }) => {
    const [data, setData] = useState<T | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const refetch = useCallback(async () => {
      setIsLoading(true);
      try {
        const result = await queryFn({} as P);
        setData(result);
        setError(null);
        return result;
      } catch (e) {
        setError(e as Error);
        setData(undefined);
        throw e;
      } finally {
        setIsLoading(false);
      }
    }, []);

    useEffect(() => {
      queryFn({} as P)
        .then(result => {
          setData(result);
          setError(null);
        })
        .catch(e => {
          setError(e as Error);
          setData(undefined);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, []);

    return { data, isLoading, error, refetch };
  };

  return useQuery;
}

// For queries with parameters
function createParameterizedQueryHook<T, P>(
  queryFn: (params: P) => Promise<T>
) {
  const useQuery = (params: P, _options?: { retry?: boolean }) => {
    const [data, setData] = useState<T | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const refetch = useCallback(async () => {
      setIsLoading(true);
      try {
        const result = await queryFn(params);
        setData(result);
        setError(null);
        return result;
      } catch (e) {
        setError(e as Error);
        setData(undefined);
        throw e;
      } finally {
        setIsLoading(false);
      }
    }, [params]);

    useEffect(() => {
      queryFn(params)
        .then(result => {
          setData(result);
          setError(null);
        })
        .catch(e => {
          setError(e as Error);
          setData(undefined);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, [JSON.stringify(params)]);

    return { data, isLoading, error, refetch };
  };

  return useQuery;
}

// Create a mutation hook
function createMutationHook<T, U>(mutationFn: (data: T) => Promise<U>) {
  const useMutation = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const mutate = async (
      data: T,
      options?: {
        onSuccess?: (result: U) => void;
        onError?: (error: Error) => void;
      }
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await mutationFn(data);
        options?.onSuccess?.(result);
        return result;
      } catch (e) {
        const error = e as Error;
        setError(error);
        options?.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    const mutateAsync = async (
      data: T,
      options?: {
        onSuccess?: (result: U) => void;
        onError?: (error: Error) => void;
      }
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await mutationFn(data);
        options?.onSuccess?.(result);
        return result;
      } catch (e) {
        const error = e as Error;
        setError(error);
        options?.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    return { mutate, mutateAsync, isLoading, error };
  };

  return useMutation;
}

// Create utils object with invalidate
function createUtils() {
  const cache = new Map<string, { data: any }>();
  const listeners = new Set<(key: string) => void>();

  const invalidate = (key: string) => {
    cache.delete(key);
    listeners.forEach(fn => fn(key));
  };

  const setData = (key: string, data: any) => {
    cache.set(key, { data });
  };

  const getData = (key: string) => {
    return cache.get(key)?.data;
  };

  return {
    invalidate,
    setData,
    getData,
    subscribe: (listener: (key: string) => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

// Create a mock tRPC-like object
export const trpc = {
  auth: {
    me: {
      useQuery: createQueryHook(async () => {
        const user = await authService.getUser();
        return { user };
      }),
    },
    logout: {
      useMutation: createMutationHook(async () => {
        await authService.signOut();
      }),
    },
  },
  adminAuth: {
    login: {
      useMutation: createMutationHook(
        async (data: { email: string; password: string }) => {
          const admin = await adminService.login(data.email, data.password);
          return { success: true, admin };
        }
      ),
    },
  },
  admin: {
    login: {
      useMutation: createMutationHook(
        async (data: { email: string; password: string }) => {
          return adminService.login(data.email, data.password);
        }
      ),
    },
    getAllEmployees: {
      useQuery: createQueryHook(async () => {
        return adminService.getAllEmployees();
      }),
    },
    createEmployee: {
      useMutation: createMutationHook(async (data: any) => {
        return adminService.createEmployee(data);
      }),
    },
    updateEmployee: {
      useMutation: createMutationHook(
        async (data: { id: number; updates: any }) => {
          return adminService.updateEmployee(data.id, data.updates);
        }
      ),
    },
    deleteEmployee: {
      useMutation: createMutationHook(async (id: number) => {
        await adminService.deleteEmployee(id);
        await adminService.deleteEmployeeRecords(id);
      }),
    },
    getMonthlyReportSummary: {
      useQuery: createParameterizedQueryHook(
        async (params: { year: number; month: number }) => {
          return adminService.getMonthlyReportSummary(
            params.year,
            params.month
          );
        }
      ),
    },
    getDailyReportSummary: {
      useQuery: createParameterizedQueryHook(
        async (params: { startDate: string; endDate: string }) => {
          return adminService.getDailyReportSummary(
            params.startDate,
            params.endDate
          );
        }
      ),
    },
    getTaskTypeDistribution: {
      useQuery: createParameterizedQueryHook(
        async (params: { startDate: string; endDate: string }) => {
          return adminService.getTaskTypeDistribution(
            params.startDate,
            params.endDate
          );
        }
      ),
    },
    seedSampleReports: {
      useMutation: createMutationHook(async () => {
        return adminService.seedSampleReports();
      }),
    },
  },
  blog: {
    list: {
      useQuery: createQueryHook(async () => {
        return blogService.getFeatured();
      }),
    },
    all: {
      useQuery: createQueryHook(async () => {
        return blogService.getAll();
      }),
    },
    bySlug: {
      useQuery: createParameterizedQueryHook(async (slug: string) => {
        return blogService.getBySlug(slug);
      }),
    },
    create: {
      useMutation: createMutationHook(async (data: any) => {
        return blogService.create(data);
      }),
    },
    update: {
      useMutation: createMutationHook(
        async (data: { id: number; updates: any }) => {
          return blogService.update(data.id, data.updates);
        }
      ),
    },
    delete: {
      useMutation: createMutationHook(async (id: number) => {
        return blogService.delete(id);
      }),
    },
    uploadImage: {
      useMutation: createMutationHook(
        async (data: {
          fileName: string;
          contentType: string;
          dataUrl: string;
        }) => {
          return blogService.uploadImage(data);
        }
      ),
    },
  },
  caseStudies: {
    list: {
      useQuery: createQueryHook(async () => {
        return caseStudiesService.getAll();
      }),
    },
    all: {
      useQuery: createQueryHook(async () => {
        return caseStudiesService.getAll();
      }),
    },
    featured: {
      useQuery: createQueryHook(async () => {
        return caseStudiesService.getFeatured();
      }),
    },
    bySlug: {
      useQuery: createParameterizedQueryHook(async (slug: string) => {
        return caseStudiesService.getBySlug(slug);
      }),
    },
    create: {
      useMutation: createMutationHook(async (data: any) => {
        return caseStudiesService.create(data);
      }),
    },
    update: {
      useMutation: createMutationHook(
        async (data: { id: number; updates: any }) => {
          return caseStudiesService.update(data.id, data.updates);
        }
      ),
    },
    delete: {
      useMutation: createMutationHook(async (id: number) => {
        return caseStudiesService.delete(id);
      }),
    },
    uploadImage: {
      useMutation: createMutationHook(
        async (data: {
          fileName: string;
          contentType: string;
          dataUrl: string;
        }) => {
          return caseStudiesService.uploadImage(data);
        }
      ),
    },
    seed: {
      useMutation: createMutationHook(async () => {
        return caseStudiesService.seedSample();
      }),
    },
  },
  services: {
    list: {
      useQuery: createQueryHook(async () => {
        return servicesService.getAll();
      }),
    },
  },
  testimonials: {
    list: {
      useQuery: createQueryHook(async () => {
        return testimonialsService.getAll();
      }),
    },
    featured: {
      useQuery: createQueryHook(async () => {
        return testimonialsService.getFeatured();
      }),
    },
  },
  leads: {
    submit: {
      useMutation: createMutationHook(async (data: any) => {
        return leadsService.submit(data);
      }),
    },
    subscribeNewsletter: {
      useMutation: createMutationHook(async (data: { email: string; type?: 'lead' | 'newsletter' | 'quote_request' }) => {
        return leadsService.subscribeNewsletter(data.email, data.type || 'newsletter');
      }),
    },
    getAll: {
      useQuery: createQueryHook(async () => {
        return leadsService.getAll();
      }),
    },
    getLeads: {
      useQuery: createParameterizedQueryHook(async (type?: string) => {
        return leadsService.getAllLeads(type as any);
      }),
    },
    getSubscriptions: {
      useQuery: createParameterizedQueryHook(async (type?: string) => {
        return leadsService.getAllSubscriptions(type as any);
      }),
    },
  },
  employee: {
    login: {
      useMutation: createMutationHook(
        async (data: { email: string; password: string }) => {
          // Use employees table for login instead of Supabase auth
          const employee = await employeeService.verifyLogin(
            data.email,
            data.password
          );

          if (!employee) {
            throw new Error("Invalid employee credentials");
          }

          // Normalise field names from snake_case to camelCase for the UI
          return {
            id: (employee as any).id,
            email: (employee as any).email,
            firstName:
              (employee as any).firstName ?? (employee as any).firstname,
            lastName: (employee as any).lastName ?? (employee as any).lastname,
            employeeId:
              (employee as any).employeeId ?? (employee as any).employeeid,
          };
        }
      ),
    },
    getRecords: {
      useQuery: createParameterizedQueryHook(async (employeeId: number) => {
        return employeeService.getRecords(employeeId);
      }),
    },
    createTimeRecord: {
      useMutation: createMutationHook(async (data: any) => {
        return employeeService.createTimeRecord(data);
      }),
    },
    deleteRecord: {
      useMutation: createMutationHook(async (id: number) => {
        return employeeService.deleteTimeRecord(id);
      }),
    },
  },
  ai: {
    chat: {
      useMutation: createMutationHook(async (data: { messages: any[] }) => {
        return {
          choices: [{ message: { content: "AI response placeholder" } }],
        };
      }),
    },
  },
  useUtils: () => createUtils(),
};

// Re-export for compatibility
export type TRPCClientError = any;
