import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { IvolveStaff } from '../types';
import { ChevronDownIcon, EmailIcon, MessageIcon, ExternalLinkIcon, SitemapIcon, UserIcon, XMarkIcon } from './Icons';

type TreeNode = IvolveStaff & { children: TreeNode[] };

type OrgChartModalProps = {
  staff: IvolveStaff[];
  currentUserId: string;
  onClose: () => void;
};

// --- PAN AND ZOOM HOOK ---
const usePanZoom = (containerRef: React.RefObject<HTMLDivElement>, contentRef: React.RefObject<HTMLDivElement>) => {
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.6 });
    const isPanning = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });

    const onMouseDown = (e: React.MouseEvent) => {
        isPanning.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
        isPanning.current = false;
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isPanning.current) return;
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;
        setTransform(t => ({ ...t, x: t.x + dx, y: t.y + dy }));
        lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const onWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const scaleAmount = -e.deltaY * 0.001;
        const newScale = Math.min(Math.max(0.2, transform.scale + scaleAmount), 2);
        
        const rect = containerRef.current!.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const newX = transform.x + (mouseX - transform.x) * (1 - newScale / transform.scale);
        const newY = transform.y + (mouseY - transform.y) * (1 - newScale / transform.scale);
        
        setTransform({ x: newX, y: newY, scale: newScale });
    };

    const centerOnNode = useCallback((nodeElement: HTMLElement) => {
        if (!containerRef.current || !contentRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const nodeRect = nodeElement.getBoundingClientRect();
        
        const newScale = 1;
        const newX = (containerRect.width / 2) - (nodeRect.left - containerRect.left + nodeRect.width / 2) * newScale;
        const newY = (containerRect.height / 2) - (nodeRect.top - containerRect.top + nodeRect.height / 2) * newScale;

        // Animate the transition
        const contentEl = contentRef.current;
        contentEl.style.transition = 'transform 0.7s ease-in-out';
        setTransform({ x: newX, y: newY, scale: newScale });
        setTimeout(() => {
            if(contentEl) contentEl.style.transition = '';
        }, 700);
    }, [containerRef, contentRef]);

    return { transform, onMouseDown, onMouseUp, onMouseMove, onWheel, centerOnNode };
};


// --- NODE COMPONENT ---
const Node: React.FC<{ node: TreeNode; onNodeClick: (node: IvolveStaff, element: HTMLDivElement) => void; isSelected: boolean }> = ({ node, onNodeClick, isSelected }) => {
    const nodeRef = useRef<HTMLDivElement>(null);
    const baseNodeClass = "relative group w-64 p-2 rounded-md shadow-md cursor-pointer border-2 transition-all duration-200";
    let specialNodeClass = "bg-org-node-bg border-org-node-border hover:border-ivolve-blue";

    if (node.isVacancy) {
        specialNodeClass = "bg-org-vacancy-bg border-org-vacancy-border";
    } else if (node.isJoiningSoon) {
        specialNodeClass = "bg-org-joining-bg border-org-joining-border";
    } else if (isSelected) {
        specialNodeClass = "bg-ivolve-blue border-ivolve-bright-green text-white";
    }

    return (
        <div className="flex flex-col items-center">
            {/* Node Card */}
            <div ref={nodeRef} id={`node-${node.id}`} className={`${baseNodeClass} ${specialNodeClass}`} onClick={() => nodeRef.current && onNodeClick(node, nodeRef.current)}>
                <div className="flex items-center">
                    {!node.isVacancy && !node.isJoiningSoon && (
                         <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white/50 flex items-center justify-center text-gray-400 flex-shrink-0">
                            <UserIcon />
                        </div>
                    )}
                    <div className="ml-3 flex-1">
                        <p className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-solas-dark'}`}>{node.name}</p>
                        <p className={`text-xs ${isSelected ? 'text-gray-200' : 'text-solas-gray'}`}>{node.role}</p>
                    </div>
                </div>
            </div>

            {/* Children */}
            {node.children.length > 0 && (
                <>
                    {/* Vertical line down */}
                    <div className="w-px h-8 bg-org-line-color"></div>
                    <div className="flex justify-center relative">
                        {/* Horizontal line */}
                        {node.children.length > 1 && (
                            <div className="absolute top-0 h-px bg-org-line-color" style={{ left: 'calc(50% / var(--child-count))', right: 'calc(50% / var(--child-count))' }}></div>
                        )}
                        {node.children.map((child, index) => (
                             <div key={child.id} className="px-4 relative" style={{'--child-count': node.children.length} as React.CSSProperties}>
                                {/* Vertical line up */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-org-line-color"></div>
                                <Node node={child} onNodeClick={onNodeClick} isSelected={false} />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};


// --- MAIN MODAL COMPONENT ---
const OrgChartModal: React.FC<OrgChartModalProps> = ({ staff, currentUserId, onClose }) => {
    const [selectedNode, setSelectedNode] = useState<IvolveStaff | null>(null);
    const [activeTeam, setActiveTeam] = useState<string>('My Team');
    
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const { transform, onMouseDown, onMouseUp, onMouseMove, onWheel, centerOnNode } = usePanZoom(containerRef, contentRef);

    const { tree, teams, currentUser } = useMemo(() => {
        const staffMap = new Map(staff.map(p => [p.id, { ...p, children: [] }]));
        const roots: TreeNode[] = [];
        const teams = new Set(staff.map(s => s.team));
        const currentUser = staff.find(s => s.id === currentUserId);

        staff.forEach(person => {
            const node = staffMap.get(person.id)!;
            if (person.managerId && staffMap.has(person.managerId)) {
                staffMap.get(person.managerId)!.children.push(node);
            } else {
                roots.push(node);
            }
        });

        return { tree: roots, teams: ['My Team', 'Entire Company Structure', ...Array.from(teams)], currentUser };
    }, [staff, currentUserId]);

    const filteredTree = useMemo(() => {
        if (activeTeam === 'Entire Company Structure') return tree;
        
        let teamToFilter = activeTeam;
        if(activeTeam === 'My Team' && currentUser) {
            teamToFilter = currentUser.team;
        }

        const teamMembers = staff.filter(s => s.team === teamToFilter);
        
        const getAncestors = (nodeId: string, staffMap: Map<string, IvolveStaff>): string[] => {
            const person = staffMap.get(nodeId);
            if (!person || !person.managerId) return [];
            return [person.managerId, ...getAncestors(person.managerId, staffMap)];
        };

        const staffMap = new Map(staff.map(p => [p.id, p]));
        const relevantIds = new Set(teamMembers.flatMap(s => [s.id, ...getAncestors(s.id, staffMap)]));

        const cloneAndFilter = (nodes: TreeNode[]): TreeNode[] => {
            return nodes
                .filter(node => relevantIds.has(node.id))
                .map(node => ({
                    ...node,
                    children: cloneAndFilter(node.children),
                }));
        };
        return cloneAndFilter(tree);
    }, [tree, staff, activeTeam, currentUser]);

    useEffect(() => {
        const userNodeElement = document.getElementById(`node-${currentUserId}`);
        if (userNodeElement) {
             // Initial zoom-out position
            const contentEl = contentRef.current;
            if (contentEl) {
                contentEl.style.transition = '';
                contentEl.style.transform = `translate(0px, 0px) scale(0.6)`;
            }
            setTimeout(() => centerOnNode(userNodeElement), 100);
        }
    }, [centerOnNode, currentUserId]);
    
    const handleNodeClick = (node: IvolveStaff, element: HTMLDivElement) => {
        setSelectedNode(node);
        centerOnNode(element);
    }
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={onClose}></div>
            <div className="relative w-full h-full max-w-7xl max-h-[90vh] bg-org-chart-bg rounded-lg shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <header className="flex-shrink-0 p-3 bg-white border-b flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                         <span className="text-ivolve-blue"><SitemapIcon /></span>
                         <h2 className="text-lg font-bold text-solas-dark">Company Structure</h2>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <select 
                            value={activeTeam} 
                            onChange={e => setActiveTeam(e.target.value)}
                            className="p-2 border rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-ivolve-blue"
                        >
                            {teams.map(team => <option key={team} value={team}>{team}</option>)}
                        </select>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close organization chart">
                            <XMarkIcon />
                        </button>
                    </div>
                </header>

                {/* Chart Area */}
                <main 
                    ref={containerRef} 
                    className="flex-grow relative overflow-hidden cursor-grab"
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                    onMouseMove={onMouseMove}
                    onWheel={onWheel}
                >
                    <div 
                        ref={contentRef}
                        style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, transformOrigin: '0 0' }}
                        className="p-16"
                    >
                       {filteredTree.map(rootNode => <Node key={rootNode.id} node={rootNode} onNodeClick={handleNodeClick} isSelected={selectedNode?.id === rootNode.id} />)}
                    </div>
                </main>
                
                 {/* Selected Node Details */}
                {selectedNode && (
                     <footer className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border flex items-start space-x-4 transition-all duration-300">
                        <div className="w-20 h-20 rounded-full bg-gray-200 border-4 border-ivolve-blue flex items-center justify-center text-gray-400 flex-shrink-0">
                            <UserIcon />
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-xl font-bold text-solas-dark">{selectedNode.name}</h3>
                            <p className="text-md text-solas-gray">{selectedNode.role}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {selectedNode.tags.map(tag => (
                                    <span key={tag} className="px-2 py-0.5 text-xs bg-gray-200 text-gray-800 rounded-full">{tag}</span>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col space-y-2 items-end">
                             <div className="flex space-x-2">
                                <a href={`mailto:${selectedNode.email}`} title="Send Email" className="p-2 bg-gray-200 rounded-full hover:bg-ivolve-blue hover:text-white transition-colors"><EmailIcon /></a>
                                <a href={`msteams:/l/chat/0/0?users=${selectedNode.email}`} title="Message on Teams" className="p-2 bg-gray-200 rounded-full hover:bg-ivolve-blue hover:text-white transition-colors"><MessageIcon /></a>
                                <button title="Open Connect Profile (coming soon)" className="p-2 bg-gray-200 rounded-full hover:bg-ivolve-blue hover:text-white transition-colors" disabled><ExternalLinkIcon /></button>
                             </div>
                             <button onClick={() => setSelectedNode(null)} className="text-sm text-gray-500 hover:underline">Clear selection</button>
                        </div>
                     </footer>
                )}
            </div>
        </div>
    );
};

export default OrgChartModal;