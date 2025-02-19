import { Action, Subject } from "types/permission"
import { useAbility } from "./abilityContext";

type GuardComponentProps = {
    action: Action;
    subject: Subject;
    context?: Record<string, any>;
    fallback?: React.ReactNode;
    children: React.ReactNode
}

export default function ({
    action,
    subject,
    context = {},
    fallback = null,
    children
}: GuardComponentProps) {
    const ability = useAbility();

    if (ability.cannot(action, subject, context)) {
        console.log("action was : ", action);
        console.log("subject was : ", subject);
        return <>{fallback}</>;
    }

    return <>{children}</>;
}