-- Event-trigger helpers should never be callable through the public API.
-- The database event trigger can continue to execute this function internally.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
