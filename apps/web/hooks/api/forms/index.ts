import { trpc } from "~/trpc/client";

export const createForm = () => {
  const {
    mutateAsync: createFormAsync,
    mutate: createFormsync,
    isError,
    failureCount,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.createForm.useMutation();

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
  const {
    mutateAsync: createFormFieldAsync,
    mutate: createFormField,
    isError,
    failureCount,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.createFormField.useMutation();

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
  const {
    mutateAsync: updateFormFieldAsync,
    mutate: updateFormField,
    isError,
    failureCount,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.updateFormField.useMutation();

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
  const {
    mutateAsync: deleteFormFieldAsync,
    mutate: deleteFormField,
    isError,
    failureCount,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.deleteFormField.useMutation();

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
  const {
    mutateAsync: submitFormAsync,
    mutate: submitForm,
    isError,
    failureCount,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.submitForm.useMutation();

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
