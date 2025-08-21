import html2canvas from 'html2canvas';

export async function capturePng(el: HTMLElement): Promise<string> {
  try {
    // Ensure element is visible for capture
    const originalPosition = el.style.position;
    const originalLeft = el.style.left;
    const originalVisibility = el.style.visibility;
    
    // Temporarily position off-screen but visible
    el.style.position = 'absolute';
    el.style.left = '-10000px';
    el.style.visibility = 'visible';
    
    const canvas = await html2canvas(el, { 
      backgroundColor: '#fff', 
      scale: 2,
      useCORS: true,
      allowTaint: true,
      width: el.offsetWidth,
      height: el.offsetHeight
    });
    
    // Restore original styles
    el.style.position = originalPosition;
    el.style.left = originalLeft;
    el.style.visibility = originalVisibility;
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error capturing chart:', error);
    // Return a placeholder image data URL
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  }
}

export async function captureChartElement(selector: string): Promise<string | null> {
  const element = document.querySelector(selector) as HTMLElement;
  if (!element) {
    console.warn(`Chart element not found: ${selector}`);
    return null;
  }
  
  return await capturePng(element);
}

export function createHiddenChartContainer(): HTMLDivElement {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = '800px';
  container.style.height = '600px';
  container.style.backgroundColor = 'white';
  document.body.appendChild(container);
  return container;
}

export function removeHiddenChartContainer(container: HTMLDivElement) {
  if (container && container.parentNode) {
    container.parentNode.removeChild(container);
  }
}