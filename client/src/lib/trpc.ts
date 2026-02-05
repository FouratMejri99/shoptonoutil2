// Mock tRPC client for frontend-only Supabase architecture
// This provides a compatible API for existing components

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

// Helper to create query hooks
function createQueryHook<T>(queryFn: () => Promise<T>) {
  let data: T | undefined;
  let isLoading = false;
  let error: Error | null = null;

  const hook = (options?: { enabled?: boolean; retry?: number }) => {
    if (options?.enabled === false) {
      return { data: undefined, isLoading: false, error: null };
    }

    isLoading = true;
    queryFn()
      .then(result => {
        data = result;
        error = null;
      })
      .catch(e => {
        error = e;
        data = undefined;
      })
      .finally(() => {
        isLoading = false;
      });

    return { data, isLoading, error };
  };

  return hook;
}

// Mock mutation helpers
function createMutationHook<T, U>(mutationFn: (data: T) => Promise<U>) {
  const mutationObj = {
    mutate: async (
      data: T,
      options?: {
        onSuccess?: (result: U) => void;
        onError?: (error: Error) => void;
      }
    ) => {
      try {
        const result = await mutationFn(data);
        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        options?.onError?.(error as Error);
        throw error;
      }
    },
    mutateAsync: async (
      data: T,
      options?: {
        onSuccess?: (result: U) => void;
        onError?: (error: Error) => void;
      }
    ) => {
      try {
        const result = await mutationFn(data);
        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        options?.onError?.(error as Error);
        throw error;
      }
    },
  };

  // Support both patterns: trpc.leads.subscribeNewsletter.useMutation() and trpc.leads.submit.mutate()
  Object.defineProperty(mutationObj, "useMutation", {
    value: () => mutationObj,
    writable: true,
    configurable: true,
  });

  return mutationObj;
}

// Create a mock tRPC-like object
export const trpc = {
  auth: {
    me: {
      useQuery: (options?: { retry?: boolean }) => {
        return createQueryHook(async () => {
          const user = await authService.getUser();
          return { user };
        })(options as any);
      },
    },
    logout: {
      useMutation: () => {
        return createMutationHook(async () => {
          await authService.signOut();
        });
      },
    },
  },
  adminAuth: {
    login: Object.assign(
      createMutationHook((data: { email: string; password: string }) =>
        adminService.login(data.email, data.password).then(admin => ({
          success: true,
          admin,
        }))
      ),
      {
        useMutation: () =>
          createMutationHook((data: { email: string; password: string }) =>
            adminService.login(data.email, data.password).then(admin => ({
              success: true,
              admin,
            }))
          ),
      }
    ),
  },
  admin: {
    login: Object.assign(
      createMutationHook((data: { email: string; password: string }) =>
        adminService.login(data.email, data.password)
      ),
      {
        useMutation: () =>
          createMutationHook((data: { email: string; password: string }) =>
            adminService.login(data.email, data.password)
          ),
      }
    ),
    getAllEmployees: Object.assign(
      createQueryHook(() => adminService.getAllEmployees()),
      {
        useQuery: createQueryHook(() => adminService.getAllEmployees()),
      }
    ),
    createEmployee: Object.assign(
      createMutationHook((data: any) => adminService.createEmployee(data)),
      {
        useMutation: () =>
          createMutationHook((data: any) => adminService.createEmployee(data)),
      }
    ),
    updateEmployee: Object.assign(
      createMutationHook((data: { id: number; updates: any }) =>
        adminService.updateEmployee(data.id, data.updates)
      ),
      {
        useMutation: () =>
          createMutationHook((data: { id: number; updates: any }) =>
            adminService.updateEmployee(data.id, data.updates)
          ),
      }
    ),
    deleteEmployee: Object.assign(
      createMutationHook((id: number) => adminService.deleteEmployee(id)),
      {
        useMutation: () =>
          createMutationHook((id: number) => adminService.deleteEmployee(id)),
      }
    ),
    getMonthlyReportSummary: Object.assign(
      createQueryHook((data: { year: number; month: number }) =>
        adminService.getMonthlyReportSummary(data.year, data.month)
      ),
      {
        useQuery: createQueryHook((data: { year: number; month: number }) =>
          adminService.getMonthlyReportSummary(data.year, data.month)
        ),
      }
    ),
    getDailyReportSummary: Object.assign(
      createQueryHook((data: { startDate: string; endDate: string }) =>
        adminService.getDailyReportSummary(data.startDate, data.endDate)
      ),
      {
        useQuery: createQueryHook(
          (data: { startDate: string; endDate: string }) =>
            adminService.getDailyReportSummary(data.startDate, data.endDate)
        ),
      }
    ),
    getTaskTypeDistribution: Object.assign(
      createQueryHook((data: { startDate: string; endDate: string }) =>
        adminService.getTaskTypeDistribution(data.startDate, data.endDate)
      ),
      {
        useQuery: createQueryHook(
          (data: { startDate: string; endDate: string }) =>
            adminService.getTaskTypeDistribution(data.startDate, data.endDate)
        ),
      }
    ),
    seedSampleReports: Object.assign(
      createMutationHook(() => adminService.seedSampleReports()),
      {
        useMutation: () =>
          createMutationHook(() => adminService.seedSampleReports()),
      }
    ),
  },
  blog: {
    list: Object.assign(
      createQueryHook(() => blogService.getFeatured()),
      {
        useQuery: createQueryHook(() => blogService.getFeatured()),
      }
    ),
    all: Object.assign(
      createQueryHook(() => blogService.getAll()),
      {
        useQuery: createQueryHook(() => blogService.getAll()),
      }
    ),
    bySlug: (slug: string) =>
      Object.assign(
        createQueryHook(() => blogService.getBySlug(slug)),
        {
          useQuery: createQueryHook(() => blogService.getBySlug(slug)),
        }
      ),
    create: Object.assign(
      createMutationHook((data: any) => blogService.create(data)),
      {
        useMutation: () =>
          createMutationHook((data: any) => blogService.create(data)),
      }
    ),
    update: Object.assign(
      createMutationHook((data: { id: number; updates: any }) =>
        blogService.update(data.id, data.updates)
      ),
      {
        useMutation: () =>
          createMutationHook((data: { id: number; updates: any }) =>
            blogService.update(data.id, data.updates)
          ),
      }
    ),
    delete: Object.assign(
      createMutationHook((id: number) => blogService.delete(id)),
      {
        useMutation: () =>
          createMutationHook((id: number) => blogService.delete(id)),
      }
    ),
    uploadImage: Object.assign(
      createMutationHook((file: File) => blogService.uploadImage(file)),
      {
        useMutation: () =>
          createMutationHook((file: File) => blogService.uploadImage(file)),
      }
    ),
  },
  caseStudies: {
    list: Object.assign(
      createQueryHook(() => caseStudiesService.getAll()),
      {
        useQuery: createQueryHook(() => caseStudiesService.getAll()),
      }
    ),
    all: Object.assign(
      createQueryHook(() => caseStudiesService.getAll()),
      {
        useQuery: createQueryHook(() => caseStudiesService.getAll()),
      }
    ),
    featured: Object.assign(
      createQueryHook(() => caseStudiesService.getFeatured()),
      {
        useQuery: createQueryHook(() => caseStudiesService.getFeatured()),
      }
    ),
    bySlug: (slug: string) =>
      Object.assign(
        createQueryHook(() => caseStudiesService.getBySlug(slug)),
        {
          useQuery: createQueryHook(() => caseStudiesService.getBySlug(slug)),
        }
      ),
    create: Object.assign(
      createMutationHook((data: any) => caseStudiesService.create(data)),
      {
        useMutation: () =>
          createMutationHook((data: any) => caseStudiesService.create(data)),
      }
    ),
    update: Object.assign(
      createMutationHook((data: { id: number; updates: any }) =>
        caseStudiesService.update(data.id, data.updates)
      ),
      {
        useMutation: () =>
          createMutationHook((data: { id: number; updates: any }) =>
            caseStudiesService.update(data.id, data.updates)
          ),
      }
    ),
    delete: Object.assign(
      createMutationHook((id: number) => caseStudiesService.delete(id)),
      {
        useMutation: () =>
          createMutationHook((id: number) => caseStudiesService.delete(id)),
      }
    ),
    seed: Object.assign(
      createMutationHook(() => caseStudiesService.seed()),
      {
        useMutation: () => createMutationHook(() => caseStudiesService.seed()),
      }
    ),
    uploadImage: Object.assign(
      createMutationHook((file: File) => caseStudiesService.uploadImage(file)),
      {
        useMutation: () =>
          createMutationHook((file: File) =>
            caseStudiesService.uploadImage(file)
          ),
      }
    ),
  },
  services: {
    list: Object.assign(
      createQueryHook(() => servicesService.getAll()),
      {
        useQuery: createQueryHook(() => servicesService.getAll()),
      }
    ),
  },
  testimonials: {
    list: Object.assign(
      createQueryHook(() => testimonialsService.getAll()),
      {
        useQuery: createQueryHook(() => testimonialsService.getAll()),
      }
    ),
    featured: Object.assign(
      createQueryHook(() => testimonialsService.getFeatured()),
      {
        useQuery: createQueryHook(() => testimonialsService.getFeatured()),
      }
    ),
  },
  leads: {
    submit: Object.assign(
      createMutationHook((data: any) => leadsService.submit(data)),
      {
        useMutation: () =>
          createMutationHook((data: any) => leadsService.submit(data)),
      }
    ),
    subscribeNewsletter: Object.assign(
      createMutationHook((email: string) =>
        leadsService.subscribeNewsletter(email)
      ),
      {
        useMutation: () =>
          createMutationHook((email: string) =>
            leadsService.subscribeNewsletter(email)
          ),
      }
    ),
  },
  employee: {
    login: Object.assign(
      createMutationHook((data: { email: string; password: string }) =>
        authService.signIn(data.email, data.password)
      ),
      {
        useMutation: () =>
          createMutationHook((data: { email: string; password: string }) =>
            authService.signIn(data.email, data.password)
          ),
      }
    ),
    getRecords: (employeeId: number) =>
      Object.assign(
        createQueryHook(() => employeeService.getRecords(employeeId)),
        {
          useQuery: createQueryHook(() =>
            employeeService.getRecords(employeeId)
          ),
        }
      ),
    createTimeRecord: Object.assign(
      createMutationHook((data: any) => employeeService.createTimeRecord(data)),
      {
        useMutation: () =>
          createMutationHook((data: any) =>
            employeeService.createTimeRecord(data)
          ),
      }
    ),
    deleteRecord: Object.assign(
      createMutationHook((id: number) => employeeService.deleteTimeRecord(id)),
      {
        useMutation: () =>
          createMutationHook((id: number) =>
            employeeService.deleteTimeRecord(id)
          ),
      }
    ),
  },
  ai: {
    chat: Object.assign(
      createMutationHook((data: { messages: any[] }) =>
        Promise.resolve({
          choices: [{ message: { content: "AI response placeholder" } }],
        })
      ),
      {
        useMutation: () =>
          createMutationHook((data: { messages: any[] }) =>
            Promise.resolve({
              choices: [{ message: { content: "AI response placeholder" } }],
            })
          ),
      }
    ),
  },
  useUtils: () => ({}),
};

// Re-export for compatibility (placeholder - actual TRPCClientError not needed for mock)
export type TRPCClientError = any;
