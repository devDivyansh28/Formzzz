import { trpc } from "~/trpc/client";

export const createForm = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: createFormAsync,
    mutate: createFormsync,
    isError,
    failureCount,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.createForm.useMutation({
    onSuccess: async () => {
      await utils.form.listAllForms.invalidate();
    },
  });

  return {
    createFormAsync,
    createFormsync,
    isError,
    failureCount,
    isIdle,
    isSuccess,
    status,
  };
};

export const listAllForms = () => {
  const {
    data,
    dataUpdatedAt,
    failureCount,
    isError,
    isFetched,
    isLoading,
    isPaused,
    isSuccess,
    status,
  } = trpc.form.listAllForms.useQuery();
  return {
    data,
    dataUpdatedAt,
    failureCount,
    isError,
    isFetched,
    isLoading,
    isPaused,
    isSuccess,
    status,
  };
};

export const createFormField = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: createFormFieldAsync,
    mutate: createFormField,
    isError,
    failureCount,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.createFormField.useMutation({
    onSuccess: async (_data, variables) => {
      await utils.form.getForm.invalidate({ formId: variables.formId });
    },
  });

  return {
    createFormFieldAsync,
    createFormField,
    isError,
    failureCount,
    isIdle,
    isSuccess,
    status,
  };
};

export const updateFormField = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: updateFormFieldAsync,
    mutate: updateFormField,
    isError,
    failureCount,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.updateFormField.useMutation({
    onSuccess: async () => {
      await utils.form.getForm.invalidate();
    },
  });

  return {
    updateFormFieldAsync,
    updateFormField,
    isError,
    failureCount,
    isIdle,
    isSuccess,
    status,
  };
};

export const getAllField = () => {
  const {
    mutateAsync: getAllFieldAsync,
    mutate: getAllField,
    isError,
    failureCount,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.getAllField.useMutation();

  return {
    getAllFieldAsync,
    getAllField,
    isError,
    failureCount,
    isIdle,
    isSuccess,
    status,
  };
};

export const deleteFormField = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: deleteFormFieldAsync,
    mutate: deleteFormField,
    isError,
    failureCount,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.deleteFormField.useMutation({
    onSuccess: async () => {
      await utils.form.getForm.invalidate();
    },
  });

  return {
    deleteFormFieldAsync,
    deleteFormField,
    isError,
    failureCount,
    isIdle,
    isSuccess,
    status,
  };
};

export const getForm = () => {
  return trpc.form.getForm.useQuery;

 
};

export const submitForm = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: submitFormAsync,
    mutate: submitForm,
    isError,
    failureCount,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.submitForm.useMutation({
    onSuccess: async (_data, variables) => {
      await utils.form.getFormSubmissions.invalidate({ formId: variables.formId });
    },
  });

  return {
    submitFormAsync,
    submitForm,
    isError,
    failureCount,
    isIdle,
    isSuccess,
    status,
  };
};

export const getFormSubmissions = () => {
  return trpc.form.getFormSubmissions.useQuery;
};
