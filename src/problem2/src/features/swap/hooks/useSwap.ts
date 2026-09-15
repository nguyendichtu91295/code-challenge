import { useMutation } from '@tanstack/react-query'
import { useRef } from 'react'
import { submitSwap } from '../swap.api'
import type { SwapRequest } from '../swap.types'

export function useSwap() {
  const mutation = useMutation({ mutationFn: submitSwap, retry: false, networkMode: 'always' })
  const submitting = useRef(false)

  function submit(request: SwapRequest) {
    // Guard the gap before React renders the pending state, including repeated Enter presses.
    if (submitting.current) return
    submitting.current = true
    mutation.mutate(request, { onSettled: () => { submitting.current = false } })
  }

  return { ...mutation, submit }
}
