import { test, expect } from '@playwright/test';
import { MprViewerPage } from '../pages/MprViewerPage';

// I chose Zoom as our tool under test because:
// - Its activation state is reflected in the toolbar DOM (not just canvas)
// - The circular menu interaction is testable via #circular-menu id
// - Reset behavior produces a verifiable DOM change
const VIEWER_URL = process.env.MPR_URL || '';

test.describe('MPR Viewer - Circular Menu & Zoom Tool', () => {

  let viewer: MprViewerPage;

  // Runs before each test — opens the viewer and waits for it to be ready
  test.beforeEach(async ({ page }) => {
    viewer = new MprViewerPage(page);
    await viewer.goto(VIEWER_URL);
    await viewer.waitForViewerReady();
  });

  // TC-01: Circular menu opens on right-click
   test('TC-01 | Right-click on canvas opens the circular menu', async () => {
    await viewer.openCircularMenu();
    await expect(viewer.circularMenu).toBeVisible();
    // Verify opened-nav class is present — this is what makes the menu visible
    await expect(viewer.circularMenu).toHaveClass(/opened-nav/);
  });

  test('TC-02 | Selecting Zoom from circular menu activates it in toolbar', async () => {
  await viewer.selectZoomFromCircularMenu();
  await expect(viewer.zoomButton).toHaveAttribute('data-state', 'active');
});

  // TC-02: Circular menu closes on Escape
   test('TC-03 | Circular menu closes when clicking outside', async () => {
  await viewer.openCircularMenu();
  await viewer.closeCircularMenu();
  await expect(viewer.circularMenu).not.toHaveClass(/opened-nav/);
  });

  test('TC-04 | Predefined Levels dropdown opens and shows expected options', async () => {
  await viewer.predefinedLevelsButton.click();
  //await expect(viewer.predefinedLevelsButton).toHaveAttribute('data-state', 'open');
  // Verify core clinical presets are present
  await expect(viewer.page.getByRole('menuitem', { name: 'Predefined levels' })).toBeVisible();
  await expect(viewer.page.getByRole('menuitem', { name: 'Mediastinum' })).toBeVisible();
  await expect(viewer.page.getByRole('menuitem', { name: 'Lung' })).toBeVisible();
  await expect(viewer.page.getByRole('menuitem', { name: 'Bone' })).toBeVisible();
  await expect(viewer.page.getByRole('menuitem', { name: 'Brain' })).toBeVisible();
  await expect(viewer.page.getByRole('menuitem', { name: 'Head' })).toBeVisible();
  await expect(viewer.page.getByRole('menuitem', { name: 'Belly' })).toBeVisible();
  await expect(viewer.page.getByRole('menuitem', { name: 'Liver' })).toBeVisible();
  
});

test('TC-05 | Selecting Mediastinum option updates the dropdown label', async () => {
  await viewer.selectPredefinedLevel('Mediastinum');
  await expect(viewer.page.getByRole('button', { name: 'Mediastinum' })).toBeVisible();
});

test('TC-06 | Zoom tool and Predefined Level options are independent — both apply simultaneously', async () => {
  // Activate Zoom first
  await viewer.selectZoomFromCircularMenu();
  await expect(viewer.zoomButton).toHaveAttribute('data-state', 'active');

  // Now change the window preset — Zoom should remain active
  await viewer.selectPredefinedLevel('Bone');
  await expect(viewer.page.getByRole('button', { name: 'Bone' })).toBeVisible();

  // Zoom must still be active — these are independent operations
  await expect(viewer.zoomButton).toHaveAttribute('data-state', 'active');
});

test('TC-07 | Circular menu closes after selecting Zoom', async () => {
  await viewer.selectZoomFromCircularMenu();
  // Menu should auto-close after tool selection — no ambiguous state
  await expect(viewer.circularMenu).not.toHaveClass(/opened-nav/);
});


test('TC-08 | No GraphQL errors on viewer load', async ({ page }) => {

  const errors: string[] = [];

  // Catch any GraphQL error before navigating
  page.on('response', async response => {
    if (!response.url().includes('graphql')) return;
    const body = await response.json().catch(() => null);
    if (body?.errors?.length) errors.push(body.errors[0].message);
  });

  await viewer.goto(VIEWER_URL);
  await viewer.waitForViewerReady();

  expect(errors).toHaveLength(0);
});

});
