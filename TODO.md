# Fix Database Persistence on Deployment

## Steps:
- [x] Update db/database.js to use process.env.DATA_FILE for persistent path on hosts like Render.
- [ ] Update db/init.js if needed for dir creation.
- [ ] Update DEPLOYMENT.md with Render persistence instructions (use Disks or external DB).
- [ ] Test locally.
- [ ] Redeploy and verify /api/health, login, order update persists after sleep.

Current progress: Local DB works. Issue confirmed Render ephemeral FS.
