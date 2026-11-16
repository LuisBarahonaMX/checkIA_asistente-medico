/* CHECK_IA NASA: presentation-only audio controls docking.
 * Does not recreate, move, remove, or alter audio controls or event handlers.
 */
import './nasa-audio-bottom.css';

const ROOT_CLASS = 'checkia-nasa-audio-bottom';
const TOGGLE_CLASS = 'checkia-nasa-audio-toggle';
const VOLUME_CLASS = 'checkia-nasa-audio-volume';
const normalize = value => (value || '').trim().replace(/\s+/g,' ').toLowerCase();

function textMatches(node, value) {
  // Use exact visible text on leaf nodes; never scan body-wide text as a match.
  const txt = normalize(node.textContent);
  if (txt !== value) return false;
  return [...node.children].every(child => normalize(child.textContent) !== value);
}

function findLabel(value) {
  // Keep to a small set of label elements to avoid walking hundreds of elements.
  const selectors = 'label,span,small,strong,b,p,div';
  const candidates = document.querySelectorAll(selectors);
  for (const el of candidates) {
    if (el.classList.contains(ROOT_CLASS)) continue;
    if (textMatches(el, value)) return el;
  }
  return null;
}

function lowestCommonAncestor(a, b) {
  const ancestorSet = new Set();
  for (let p = a; p && p !== document.body; p = p.parentElement) ancestorSet.add(p);
  for (let p = b; p && p !== document.body; p = p.parentElement) {
    if (ancestorSet.has(p)) return p;
  }
  return null;
}

function audioControlsContainer() {
  const ambient = findLabel('ambient audio');
  const volume = findLabel('volume');
  if (!ambient || !volume) return null;
  let group = lowestCommonAncestor(ambient, volume);
  if (!group || group === document.body) return null;
  // If mission status is inside the group, never reposition the entire banner.
  if (normalize(group.textContent).includes('mission assessment active')) return null;
  // Do not reposition a whole main layout just because it has a volume slider.
  if (group.querySelectorAll('input').length > 3) return null;
  if (group.getBoundingClientRect().height > 170) return null;
  return group;
}

function safeSingleControl(label, inputType) {
  if (!label) return null;
  for (let el = label; el && el !== document.body; el = el.parentElement) {
    if (normalize(el.textContent).includes('mission assessment active')) return null;
    const inputs = [...el.querySelectorAll('input')];
    if (inputs.some(input => input.type === inputType) && inputs.length <= 2 && el.getBoundingClientRect().height < 100) return el;
  }
  return null;
}

function dock() {
  if (document.querySelector('.'+ROOT_CLASS)) return true;
  const group = audioControlsContainer();
  if (group) {
    group.classList.add(ROOT_CLASS);
    group.setAttribute('data-checkia-nasa-audio-layout','bottom-half-size');
    return true;
  }
  // Fallback: keep the mission status where it is and dock each existing audio
  // control independently. No new UI is created and React nodes are not moved.
  if (document.querySelector('.'+TOGGLE_CLASS) && document.querySelector('.'+VOLUME_CLASS)) return true;
  const toggle = safeSingleControl(findLabel('ambient audio'), 'checkbox');
  const volume = safeSingleControl(findLabel('volume'), 'range');
  if (!toggle || !volume || toggle === volume || toggle.contains(volume) || volume.contains(toggle)) return false;
  toggle.classList.add(TOGGLE_CLASS);
  volume.classList.add(VOLUME_CLASS);
  return true;
}

if (typeof document !== 'undefined') {
  function initialize() {
    if (dock()) return;
    const observer = new MutationObserver(() => {
      if (dock()) observer.disconnect();
    });
    observer.observe(document.body, {childList:true,subtree:true});
    // Stop observing after 20s to avoid an indefinite observer if this UI is absent.
    window.setTimeout(() => observer.disconnect(), 20000);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded',initialize,{once:true});
  } else {
    initialize();
  }
}
