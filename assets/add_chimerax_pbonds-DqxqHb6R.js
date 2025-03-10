const n=`import json
from collections import defaultdict


def list_models():
    data = json.loads('%%data%%')

    for model in session.models:
        if not hasattr(model, 'find_residue'):
            continue

        groups = defaultdict(list)
        for group, chain1, pos1, chain2, pos2 in data:
            res1 = model.find_residue(chain1, pos1)
            if res1 is None:
                break
            atom1 = res1.find_atom('CA')
            if atom1 is None:
                break

            res2 = model.find_residue(chain2, pos2)
            if res2 is None:
                break
            atom2 = res2.find_atom('CA')
            if atom2 is None:
                break

            groups[group].append((atom1, atom2))
        else:
            yield model, groups


for model, groups in list(list_models()):
    pbond_groups = []
    for group_name, atom_pairs in groups.items():
        group = session.pb_manager.get_group(group_name)
        for atom1, atom2 in atom_pairs:
            bond = group.new_pseudobond(atom1, atom2)
            bond.radius = 0.8
            if group_name == '%%under%%':
                bond.color =  [243, 168, 59, 255]
            elif group_name == '%%ok%%':
                bond.color = [55, 125, 34, 255]
            elif group_name == '%%over%%':
                bond.color = [235, 50, 35, 255]
        pbond_groups.append(group)
    session.models.add_group(pbond_groups, name='%%experiment_name%%', parent=model)
`;export{n as default};
