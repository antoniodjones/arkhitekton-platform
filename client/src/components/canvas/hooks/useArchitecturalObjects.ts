import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    type ArchitecturalModel,
    type ArchitecturalObject,
    type InsertArchitecturalObject
} from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function useArchitecturalModels() {
    return useQuery<ArchitecturalModel[]>({
        queryKey: ["/api/architectural-models"],
    });
}

export function useArchitecturalModel(id: string) {
    return useQuery<ArchitecturalModel>({
        queryKey: [`/api/architectural-models/${id}`],
        enabled: !!id,
    });
}

export function useArchitecturalObjects(modelId: string) {
    return useQuery<ArchitecturalObject[]>({
        queryKey: [`/api/architectural-models/${modelId}/objects`],
        enabled: !!modelId,
    });
}

export function useCreateArchitecturalObject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newObject: InsertArchitecturalObject) => {
            const res = await apiRequest("POST", "/api/architectural-objects", newObject);
            return res.json();
        },
        onSuccess: (data: ArchitecturalObject) => {
            queryClient.invalidateQueries({
                queryKey: [`/api/architectural-models/${data.modelId}/objects`]
            });
        },
    });
}

// Update Visuals (Specific optimized mutation)
export function useUpdateArchitecturalObjectVisuals() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, visual }: { id: string; visual: any }) => {
            const res = await apiRequest("PATCH", `/api/architectural-objects/${id}`, { visual });
            return res.json();
        },
        onSuccess: (data: ArchitecturalObject) => {
            queryClient.invalidateQueries({
                queryKey: [`/api/architectural-models/${data.modelId}/objects`]
            });
        },
    });
}

// Generic Update
export function useUpdateArchitecturalObject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<ArchitecturalObject> }) => {
            const res = await apiRequest("PATCH", `/api/architectural-objects/${id}`, updates);
            return res.json();
        },
        onSuccess: (data: ArchitecturalObject) => {
            queryClient.invalidateQueries({
                queryKey: [`/api/architectural-models/${data.modelId}/objects`]
            });
        },
    });
}

// Generic Delete
export function useDeleteArchitecturalObject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await apiRequest("DELETE", `/api/architectural-objects/${id}`);
            return id;
        },
        onSuccess: (data, variables) => {
            // We don't have modelId easily accessible on delete unless we pass it or invalidate all
            // Ideally we invalidate broad or look up cache
            queryClient.invalidateQueries({
                queryKey: ["/api/architectural-models"]
            });
            // Also invalidate specific model objects if possible. 
            // For now, assume re-fetching parent model or just invalidating generically.
            // Actually, we can invalidate based on active query?
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === '/api/architectural-models' && query.queryKey[2] === 'objects'
            });
        },
    });
}
